import { noticeSchema } from "../../../pages/noticeboard/new";
import { protectedProcedure, router } from "../trpc";

export const noticeRouter = router({
  // create /api/notice
  create: protectedProcedure.input(noticeSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { title, uploadUrl, name, size, type, key, state } = input;

    const userId = session.user.id;

    return prisma.notice.create({
      data: {
        title,
        uploadUrl,
        name,
        size,
        type,
        key,
        state,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
});
