"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";

import { columns } from "../components/columns";
import { useRouter } from "next/navigation";

export const MeetingView = () => {
  const router= useRouter()
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meeting.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable 
        data={data.items} 
        columns={columns} 
        onRowClick={(row) => router.push(`/meetings/${row.id}`) }
       />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate,
          share ideas, and interact with participants in real time."
        />
      )}
    </div>
  );
};

export const MeetingViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds"
    />
  );
};

export const MeetingViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="Something went wrong"
    />
  );
};
