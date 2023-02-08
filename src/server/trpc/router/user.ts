import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { object, z } from "zod";

// const userSchema = object({
//   id: z.string(),
//   firstName: z.string().optional(),
//   lastName: z.string().optional(),
//   email: z.string(),
//   organisation: z.string().optional(),
// });

export const userRouter = router({
  // create /api/user
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
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
