import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { noticeSchema } from "../../../pages/noticeboard/new";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import s3 from "../../../utils/s3";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

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
        limit: z.number().min(1).max(100).default(10),
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

      for (let notice of notices) {
        const url = "https://d1ve2d1xbf677h.cloudfront.net/" + notice.key;
        notice.uploadUrl = url;
      }

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

  // delete /api/notice
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const { prisma } = ctx;

      const notices = await prisma.notice.findUnique({
        where: { id },
      });

      if (!notices) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notice not found",
        });
      }

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: notices.key as string,
      };

      await s3.send(new DeleteObjectCommand(params));
      await prisma.notice.delete({ where: { id } });

      return notices;
    }),
});
