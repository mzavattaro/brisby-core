import { documentSchema } from "../../../pages/noticeboard/upload";
import { protectedProcedure, router } from "../trpc";

export const documentRouter = router({
  // create /api/document
  create: protectedProcedure
    .input(documentSchema)
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;

      const { name, size, type, uploadUrl, key } = input;

      return prisma.document.create({
        data: {
          name,
          size,
          type,
          uploadUrl,
          key,
        },
      });
    }),
});
