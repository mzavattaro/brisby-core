import { z } from "zod";
import { noticeSchema } from "../../../pages/noticeboard/new";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const noticeRouter = router({
  // create /api/bulding notice
  create: protectedProcedure.input(noticeSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const {
      title,
      uploadUrl,
      name,
      size,
      type,
      key,
      state,
      startDate,
      endDate,
    } = input;

    const userId = session.user.id;

    return prisma.notice.create({
      data: {
        title,
        uploadUrl,
        name,
        size,
        type,
        key,
        state,
        startDate,
        endDate,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),

  // list /api/notice
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(5),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { limit, cursor } = input;
      const notices = await prisma.notice.findMany({
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (notices.length > limit) {
        const nextItem = notices.pop() as (typeof notices)[number];
        nextCursor = nextItem.id;
      }

      return {
        notices,
        nextCursor,
      };
    }),
});
