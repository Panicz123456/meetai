import { Suspense } from "react";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  MeetingView,
  MeetingViewError,
  MeetingViewLoading,
} from "@/modules/meeting/ui/views/meeting-view";
import { MeetingListHeader } from "@/modules/meeting/ui/components/meeting-list-header";
import { loadSearchParams } from "@/modules/meeting/params";

interface Props  { 
  searchParams: Promise<SearchParams>
}

const page = async ({searchParams}: Props) => {
  const filters = await loadSearchParams(searchParams)
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({
    ...filters
  }));

  return (
    <>
      <MeetingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingViewLoading />}>
          <ErrorBoundary fallback={<MeetingViewError />}>
            <MeetingView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default page;
