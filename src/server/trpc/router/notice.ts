import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import s3 from '../../../utils/s3';
import cloudFront from '../../../utils/cloudFront';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

/**
 * Default selector for Notice.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const noticeRouter = router({
  // create /api/notice
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
        id,
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
              id,
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

  // get all notices by organisation
  listAll: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        orderBy: z.enum(['desc', 'asc']),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, orderBy, limit } = input;

      const sessionOrganisationId = session.user.organisationId;

      const notices = await prisma.notice.findMany({
        where: {
          organisationId: sessionOrganisationId,
          buildingComplexId: id,
          OR: [{ status: 'published' }, { status: 'draft' }],
        },
        take: limit,
        orderBy: [{ createdAt: orderBy }],
        select: {
          id: true,
          fileName: true,
          title: true,
          startDate: true,
          endDate: true,
          status: true,
          author: {
            select: { name: true },
          },
        },
      });
      return notices;
    }),

  // infinite list /api/notice
  infiniteList: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        organisationId: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { limit, skip, cursor, id } = input;

      const sessionOrganisationId = session.user.organisationId;

      const notices = await prisma.notice.findMany({
        where: {
          organisationId: sessionOrganisationId,
          buildingComplexId: id,
          OR: [{ status: 'published' }, { status: 'draft' }],
        },
        take: limit + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: 'desc' }],
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
        if (notice.key === null) {
          // eslint-disable-next-line no-console
          console.log('Notice key is null');
        } else {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        }
      }

      const nextCursor = notices.length > limit ? notices.pop()?.id : undefined;

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

      const notice = await prisma.notice.findUnique({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          title: true,
          status: true,
          startDate: true,
          endDate: true,
          fileName: true,
          uploadUrl: true,
          key: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          buildingComplex: {
            select: {
              name: true,
              streetAddress: true,
              suburb: true,
            },
          },
        },
      });

      if (!notice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notice not found',
        });
      }

      if (notice.key) {
        const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
        notice.uploadUrl = url;
      } else {
        // eslint-disable-next-line no-console
        console.log('Notice key is undefined');
      }
      return notice;
    }),

  archived: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        organisationId: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, id } = input;
      const { prisma, session } = ctx;

      const sessionOrganisationId = session.user.organisationId;

      const notices = await prisma.notice.findMany({
        where: {
          organisationId: sessionOrganisationId,
          buildingComplexId: id,
          status: 'archived',
        },
        take: limit + 1,
        skip,
        orderBy: [{ createdAt: 'desc' }],
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
        if (notice.key) {
          const url = `https://d1ve2d1xbf677h.cloudfront.net/${notice.key}`;
          notice.uploadUrl = url;
        } else {
          // eslint-disable-next-line no-console
          console.log('Notice key is undefined');
        }
      }

      const nextCursor = notices.length > limit ? notices.pop()?.id : undefined;

      return {
        notices,
        nextCursor,
      };
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

      const uniqueNotice = await prisma.notice.findUnique({
        where: { id },
      });

      if (!uniqueNotice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notice not found',
        });
      }

      const notice = await prisma.notice.update({
        where: {
          id,
        },
        data,
      });

      return notice;
    }),

  // update many notice's statuses based on notice ID
  archiveManyNotices: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        data: z.object({
          status: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { ids, data } = input;

      const notices = await prisma.notice.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data,
      });

      return notices;
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
          code: 'NOT_FOUND',
          message: 'Notice not found',
        });
      }

      const noticeskey = notices.key ?? '';

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: noticeskey,
      };
      // Delete from s3 bucket
      await s3.send(new DeleteObjectCommand(params));

      // Invalidate the CloudFront cache
      const invalidationParams = {
        DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: noticeskey,
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
