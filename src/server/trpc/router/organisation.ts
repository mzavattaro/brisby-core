// import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
    .mutation(({ ctx, input }) => {
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
});
