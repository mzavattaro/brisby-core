// import { PrismaClient } from "@prisma/client";
// import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        streetAddress: z.string(),
        suburb: z.string(),
        state: z.string(),
        postcode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { fullName, email, phone, streetAddress, suburb, state, postcode } =
        input;

      const sessionOrganisationId = session.user.organisationId;

      return prisma.billing.create({
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
    }),

  // update /api/organisation
  //   update: protectedProcedure
  //     .input(
  //       z.object({
  //         id: z.string().optional(),
  //         name: z.string().optional(),
  //         streetAddress: z.string().optional(),
  //         suburb: z.string().optional(),
  //         state: z.string().optional(),
  //         postcode: z.string().optional(),
  //       })
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       const { prisma, session } = ctx;
  //       const { name, streetAddress, suburb, state, postcode } = input;

  //       const organisationId = session.user.organisationId;

  //       await prisma.organisation.findUniqueOrThrow({
  //         where: {
  //           id: organisationId,
  //         },
  //       });

  //       const organisation = await prisma.organisation.update({
  //         where: { id: organisationId },
  //         data: {
  //           name,
  //           streetAddress,
  //           suburb,
  //           state,
  //           postcode,
  //         },
  //       });
  //       return organisation;
  //     }),

  // get billing by id /api/billing
  //   byId: protectedProcedure
  //     .input(
  //       z.object({
  //         id: z.string().optional(),
  //         organisation: z.object({
  //           id: z.string().optional(),
  //         }),
  //       })
  //     )
  //     .query(async ({ ctx, input }) => {
  //       const { prisma, session } = ctx;
  //       //   const { id } = input;

  //       const organisationId = session.user.organisationId;

  //       await prisma.organisation.findUniqueOrThrow({
  //         where: {
  //           id: organisationId,
  //         },
  //       });

  //       const billing = await prisma.billing.findUniqueOrThrow({
  //         where: {
  //           id: { in: organisationId },
  //         },
  //         select: {
  //           id: true,
  //           fullName: true,
  //           email: true,
  //           phone: true,
  //           streetAddress: true,
  //           suburb: true,
  //           state: true,
  //           postcode: true,
  //         },
  //       });

  //       return billing;
  //     }),
});
