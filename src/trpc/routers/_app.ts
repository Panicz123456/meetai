import { agentsRouter } from "@/modules/agents/server/procedures";
import { meetingRouter } from "@/modules/meeting/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: meetingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
