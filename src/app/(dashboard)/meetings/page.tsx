import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  MeetingView,
  MeetingViewError,
  MeetingViewLoading,
} from "@/modules/meeting/ui/views/meeting-view";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingViewLoading />}>
        <ErrorBoundary fallback={<MeetingViewError />}>
          <MeetingView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
