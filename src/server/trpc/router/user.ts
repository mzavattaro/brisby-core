import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { object, z } from "zod";

const userSchema = object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string(),
  organisation: z.string().optional(),
});

export const userRouter = router({
  // create /api/user
  // create: protectedProcedure.input(userSchema).mutation(({ ctx, input }) => {
  //   const { prisma, session } = ctx;
  //   const { firstName, lastName, email, organisation } = input;
  //   const userId = session.user.id;
  //   return prisma.user.create({
  //     data: {
  //       firstName,
  //       lastName,
  //       email,
  //       organisation,
  //     },
  //   });
  // }),

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
