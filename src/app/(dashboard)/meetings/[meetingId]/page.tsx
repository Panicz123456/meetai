import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"

import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { auth } from "@/lib/auth"

import {
  MeetingIdView,
  MeetingIdViewError,
  MeetingIdViewLoading
} from "@/modules/meeting/ui/views/meeting-id-view"

interface Props {
  params: Promise<{
    meetingId: string
  }>
}

const page = async ({ params }: Props) => {
  const { meetingId } = await params

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId })
  )
  // TODO: Prefetch meeting.getTranscript

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <ErrorBoundary fallback={<MeetingIdViewError />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page