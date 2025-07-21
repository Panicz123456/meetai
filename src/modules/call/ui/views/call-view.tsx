import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface Props { 
	meetingId: string
}

export const CallView = ({meetingId}: Props) => { 
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.meeting.getOne.queryOptions({ id: meetingId }))
	
	return ( 
		<div>
			{JSON.stringify(data, null, 2)}
		</div>
	)
}