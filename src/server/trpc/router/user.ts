import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = router({
  // get user by id /api/user
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx }) => {
      const { prisma, session } = ctx;

      const userId = session.user.id;

      const users = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
          organisation: {
            select: { name: true },
          },
          buildingComplex: { select: { name: true } },
        },
      });

      return users;
    }),

  // update /api/user
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { data } = input;

      const userId = session.user.id;

      const users = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!users) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });
      return user;
    }),

  // check user exists by email /api/user
  byEmail: publicProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email } = input;

      const exists = await prisma.user.findFirst({
        where: { email },
        select: { email: true },
      });

      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User doesn't exist",
        });
      }
      return exists;
    }),
});
