/*
 * import { PrismaClient } from "@prisma/client";
 * import { TRPCError } from "@trpc/server";
 */
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const billingRouter = router({
  // create /api/billing
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        streetAddress: z.string().optional(),
        suburb: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { fullName, email, phone, streetAddress, suburb, state, postcode } =
        input;

      const sessionOrganisationId = session.user.organisationId;

      const billing = await prisma.billing.create({
        data: {
          fullName,
          email,
          phone,
          streetAddress,
          suburb,
          state,
          postcode,
          organisation: {
            connect: {
              id: sessionOrganisationId,
            },
          },
        },
      });
      return billing;
    }),

  // update /api/billing
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        streetAddress: z.string().optional(),
        suburb: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const {
        id,
        fullName,
        email,
        phone,
        streetAddress,
        suburb,
        state,
        postcode,
      } = input;

      const { organisationId } = session.user;

      await prisma.billing.findUniqueOrThrow({
        where: {
          id,
        },
      });

      const organisation = await prisma.billing.update({
        where: { id },
        data: {
          fullName,
          email,
          phone,
          streetAddress,
          suburb,
          state,
          postcode,
          organisation: {
            connect: {
              id: organisationId,
            },
          },
        },
      });
      return organisation;
    }),
});
