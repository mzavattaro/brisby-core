// import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const buildingComplexRouter = router({
  // create building complex /api/buildingComplex/create
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        totalOccupancies: z.number(),
        streetAddress: z.string(),
        suburb: z.string(),
        state: z.string(),
        postcode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const {
        name,
        type,
        totalOccupancies,
        streetAddress,
        suburb,
        state,
        postcode,
      } = input;

      const sessionOrganisationId = session.user.organisationId;
      const sesserionUserId = session.user.id;

      return prisma.buildingComplex.create({
        data: {
          name: name,
          type: type,
          totalOccupancies: totalOccupancies,
          streetAddress: streetAddress,
          suburb: suburb,
          state: state,
          postcode: postcode,
          organisation: {
            connect: {
              id: sessionOrganisationId,
            },
          },
          user: {
            connect: {
              id: sesserionUserId,
            },
          },
        },
      });
    }),

  findAnEntry: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const buildingComplexes = await prisma.buildingComplex.findFirst({
      select: {
        id: true,
      },
    });

    if (!buildingComplexes) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building complexes not found",
      });
    }

    return buildingComplexes;
  }),

  // get single /api/buildingComplex by id
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      const buildingComplex = await prisma.buildingComplex.findUnique({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          name: true,
          type: true,
          totalOccupancies: true,
          notice: true,
          streetAddress: true,
          suburb: true,
        },
      });

      if (!buildingComplex) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Building complex not found",
        });
      }

      return buildingComplex;
    }),

  // get all building complexes by organsation /api/buildingComplex by organsation
  byOrganisation: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const sessionOrganisationId = session.user.organisationId;

    const buildingComplexes = await prisma.buildingComplex.findMany({
      where: { organisationId: sessionOrganisationId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        type: true,
        totalOccupancies: true,
        streetAddress: true,
        suburb: true,
        organisation: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!buildingComplexes) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building complexes not found",
      });
    }

    return buildingComplexes;
  }),
});
