import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentsForm } from "./agents-form";

import { AgentGetOne } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne
};

export const UpdateAgentDialog = ({
  onOpenChange,
  open,
  initialValues
}: Props) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValue={initialValues}
      />
    </ResponsiveDialog>
  );
};
