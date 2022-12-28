import { protectedProcedure, router } from "../trpc";
import { object, z } from "zod";

const userSchema = object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string(),
});

export const userRouter = router({
  // create /api/user
  create: protectedProcedure.input(userSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { firstName, lastName, email, image } = input;

    const userId = session.user.id;

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        image,
      },
    });
  }),
});
