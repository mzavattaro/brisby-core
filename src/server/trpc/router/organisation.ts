// import { PrismaClient } from "@prisma/client";
// import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const organisationRouter = router({
  // create /api/organisation
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { name } = input;

      const userId = session.user.id;

      return prisma.organisation.create({
        data: {
          name,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  // update /api/organisation
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        streetAddress: z.string().optional(),
        suburb: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { name, streetAddress, suburb, state, postcode } = input;

      const organisationId = session.user.organisationId;

      await prisma.organisation.findUniqueOrThrow({
        where: {
          id: organisationId,
        },
      });

      const organisation = await prisma.organisation.update({
        where: { id: organisationId },
        data: {
          name,
          streetAddress,
          suburb,
          state,
          postcode,
        },
      });
      return organisation;
    }),

  // get organisation by id /api/organisation
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      const organisation = await prisma.organisation.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          streetAddress: true,
          suburb: true,
          state: true,
          postcode: true,
        },
      });

      return organisation;
    }),

  // get organisation billing /api/organisation
  getBilling: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const organisationId = session.user.organisationId;

    try {
      const billing = await prisma.organisation
        .findUniqueOrThrow({
          where: { id: organisationId },
        })
        .billing();
      return billing;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }),
});
