import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { agents, meeting } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { meetingInsertSchema, meetingUpdateSchema } from "@/schema/meeting";
import { MeetingStatus } from "../types";

export const meetingRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removeMeeting] = await db
        .delete(meeting)
        .where(
          and(
            eq(meeting.id, input.id),
            eq(meeting.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!removeMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meetings not found",
        });
      }

      return removeMeeting;
    }),
  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedMeeting] = await db
        .update(meeting)
        .set(input)
        .where(
          and(
            eq(meeting.id, input.id),
            eq(meeting.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meetings not found",
        });
      }

      return updatedMeeting;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meeting),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(
          and(
            eq(meeting.id, input.id),
            eq(meeting.userId, ctx.auth.user.id)
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, status, agentId } = input;

      const data = await db
        .select({
          ...getTableColumns(meeting),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(
          and(
            eq(meeting.userId, ctx.auth.user.id),
            search ? ilike(meeting.name, `%${search}%`) : undefined,
            status ? eq(meeting.status, status) : undefined,
            agentId ? eq(meeting.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meeting.createdAt), desc(meeting.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(
          and(
            eq(meeting.userId, ctx.auth.user.id),
            search ? ilike(meeting.name, `%${search}%`) : undefined,
            status ? eq(meeting.status, status) : undefined,
            agentId ? eq(meeting.agentId, agentId) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createMeeting] = await db
        .insert(meeting)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      //TODO: Create Stream Call, Upsert Stream Users

      return createMeeting;
    }),
});
