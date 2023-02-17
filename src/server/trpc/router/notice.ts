// import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import s3 from "../../../utils/s3";
import cloudFront from "../../../utils/cloudFront";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

/**
 * Default selector for Notice.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

// type BuildingComplexByIdOutput = RouterOutputs["buildingComplex"]["byId"];

export const noticeRouter = router({
  // create /api/notice
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        uploadUrl: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
        key: z.string().optional(),
        status: z.string().optional(),
        startDate: z.date().nullable().optional(),
        endDate: z.date().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const {
        title,
        uploadUrl,
        fileName,
        fileSize,
        fileType,
        key,
        status,
        startDate,
        endDate,
      } = input;

      const userId = session.user.id;
      const sessionBuildingComplexId = session.user.buildingComplexId;
      const sessionOrganisationId = session.user.organisationId;

      return prisma.notice.create({
        data: {
          title,
          uploadUrl,
          fileName,
          fileSize,
          fileType,
          key,
          status,
          startDate,
          endDate,
          author: {
            connect: {
              id: userId,
            },
          },
          buildingComplex: {
            connect: {
              id: sessionBuildingComplexId,
            },
          },
          organisation: {
            connect: {
              id: sessionOrganisationId,
            },
          },
        },
      });
    }),

  // list /api/notice
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        organisationId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { limit, cursor } = input;

      const sessionOrganisationId = session.user.organisationId;

      const notices = await prisma.notice.findMany({
        where: { organisationId: sessionOrganisationId },
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      for (const notice of notices) {
        if (!notice.key) {
          console.log("Notice key is undefined");
        } else {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        }
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (notices.length > limit) {
        const nextItem = notices.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notices,
        nextCursor,
      };
    }),

  // get multiple notices /api/notice by when state is published
  published: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const notices = await ctx.prisma.notice.findMany({
        where: { status: "published" },
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      for (const notice of notices) {
        if (!notice.key) {
          console.log("Notice key is undefined");
        } else {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        }
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (notices.length > limit) {
        const nextItem = notices.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notices,
        nextCursor,
      };
    }),

  // get multiple notices /api/notice by when state is draft
  drafts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const notices = await ctx.prisma.notice.findMany({
        where: { status: "draft" },
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      for (const notice of notices) {
        if (!notice.key) {
          console.log("Notice key is undefined");
        } else {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        }
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (notices.length > limit) {
        const nextItem = notices.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notices,
        nextCursor,
      };
    }),

  archived: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const notices = await ctx.prisma.notice.findMany({
        where: { status: "archived" },
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      for (const notice of notices) {
        if (!notice.key) {
          console.log("Notice key is undefined");
        } else {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        }
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (notices.length > limit) {
        const nextItem = notices.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notices,
        nextCursor,
      };
    }),

  // get single /api/notice by id
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      const notice = await prisma.notice.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          title: true,
          status: true,
          startDate: true,
          endDate: true,
          fileName: true,
        },
      });

      return notice;
    }),

  // update /api/notice
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          status: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id, data } = input;

      await prisma.notice.findUniqueOrThrow({
        where: { id },
      });

      const notice = await prisma.notice.update({
        where: {
          id,
        },
        data,
      });
      return notice;
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

      const noticeskey = notices.key as string;

      // Invalidate the CloudFront cache
      const invalidationParams = {
        DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: notices.key as string,
          Paths: {
            Quantity: 1,
            Items: [`/${noticeskey}`],
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
