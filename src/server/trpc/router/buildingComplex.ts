// import { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { userSession } from "../../../utils/userSession";

export const buildingComplexRouter = router({
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

      const buildingComplexId = userSession()?.buildingComplexId;

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
