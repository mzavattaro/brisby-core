import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import s3 from "../../../utils/s3";
import cloudFront from "../../../utils/cloudFront";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

export const noticeRouter = router({
  // create /api/bulding notice
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required" }),
        fileList:
          typeof window === "undefined" ? z.any() : z.instanceof(FileList),
        uploadUrl: z.string(),
        name: z.string().optional(),
        size: z.number().optional(),
        type: z.string().optional(),
        key: z.string().optional(),
        state: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
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
      // Delete from s3 bucket
      await s3.send(new DeleteObjectCommand(params));

      // Invalidate the CloudFront cache
      const invalidationParams = {
        DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: notices.key as string,
          Paths: {
            Quantity: 1,
            Items: [`/${notices.key}`],
          },
        },
      };

      const invalidationCommand = new CreateInvalidationCommand(
        invalidationParams
      );
      await cloudFront.send(invalidationCommand);

      // Delete from database
      await prisma.notice.delete({ where: { id } });

      return notices;
    }),
});
