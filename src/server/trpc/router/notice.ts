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
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { limit } = input;
      const notices = await prisma.notice.findMany({
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        include: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });

      return {
        notices,
      };
    }),
});
