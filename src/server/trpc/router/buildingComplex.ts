// import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const buildingComplexRouter = router({
  // get single /api/buildingComplex by id
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      const { prisma, session } = ctx;

      const buildingComplexId = session.user.buildingComplexId;

      const buildingComplex = await prisma.buildingComplex.findUniqueOrThrow({
        where: { id: buildingComplexId },
        select: {
          id: true,
          createdAt: true,
          name: true,
          type: true,
          totalOccupancies: true,
          notice: true,
        },
      });

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
      },
    });

    if (!buildingComplexes) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Notices not found",
      });
    }

    return buildingComplexes;
  }),
});
