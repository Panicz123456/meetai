import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { meetingInsertSchema, meetingInsertSchemaType } from "@/schema/meeting";
import { MeetingGetOne } from "@/modules/meeting/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generated-avatar";
import { NewAgentsDialog } from "@/modules/agents/ui/components/new-agents-dialog";

type Props = {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValue?: MeetingGetOne;
};

export const MeetingForm = ({ initialValue, onCancel, onSuccess }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  const createMeeting = useMutation(
    trpc.meeting.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meeting.getMany.queryOptions({})
        );

        // After edit data will change immediately
        if (initialValue?.id) {
          queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValue.id })
          );
        }

        // TODO: Invalidate free tier usage
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meeting.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meeting.getMany.queryOptions({})
        );

        if (initialValue?.id) {
          queryClient.invalidateQueries(
            trpc.meeting.getOne.queryOptions({ id: initialValue.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<meetingInsertSchemaType>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      agentId: initialValue?.agentId ?? "",
    },
  });

  const isEdit = !!initialValue?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: meetingInsertSchemaType) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValue.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <NewAgentsDialog open={open} onOpenChange={setOpen} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Math Consultions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GenerateAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpen(true)}>
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}>
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : " Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
