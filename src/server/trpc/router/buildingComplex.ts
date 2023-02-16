// import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
});
