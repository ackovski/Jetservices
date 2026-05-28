import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { messages, students } from "../../drizzle/schema";
import { eq, and, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const messagingRouter = router({
  // Get conversations for current user
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const result = await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, ctx.user.id),
          eq(messages.receiverId, ctx.user.id)
        )
      )
      .limit(1000);

    // Group by conversation
    const conversations = new Map();
    result.forEach((msg) => {
      const otherUserId = msg.senderId === ctx.user.id ? msg.receiverId : msg.senderId;
      const key = [Math.min(ctx.user.id, otherUserId), Math.max(ctx.user.id, otherUserId)].join("-");
      
      if (!conversations.has(key)) {
        conversations.set(key, {
          otherUserId,
          messages: [],
          lastMessage: msg,
        });
      }
      conversations.get(key).messages.push(msg);
    });

    return Array.from(conversations.values());
  }),

  // Get messages with a specific user
  getMessages: protectedProcedure
    .input(z.object({
      otherUserId: z.number(),
      studentId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query: any = db
        .select()
        .from(messages)
        .where(
          or(
            and(eq(messages.senderId, ctx.user.id), eq(messages.receiverId, input.otherUserId)),
            and(eq(messages.senderId, input.otherUserId), eq(messages.receiverId, ctx.user.id))
          )
        );

      if (input.studentId) {
        query = query.where(eq(messages.studentId, input.studentId));
      }

      const result = await query.limit(1000);
      return result;
    }),

  // Send message
  send: protectedProcedure
    .input(z.object({
      receiverId: z.number(),
      content: z.string(),
      studentId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(messages).values({
        senderId: ctx.user.id,
        receiverId: input.receiverId,
        studentId: input.studentId,
        content: input.content,
        isRead: 0,
      });

      return result;
    }),

  // Mark message as read
  markAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: messageId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .update(messages)
        .set({ isRead: 1 })
        .where(eq(messages.id, messageId));

      return result;
    }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const result = await db
      .select()
      .from(messages)
      .where(and(eq(messages.receiverId, ctx.user.id), eq(messages.isRead, 0)))
      .limit(1000);

    return result.length;
  }),
});
