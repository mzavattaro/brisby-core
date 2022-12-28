import { noticeSchema } from "../../../pages/noticeboard/new";
import { protectedProcedure, router } from "../trpc";

export const noticeRouter = router({
  // create /api/notice
  create: protectedProcedure.input(noticeSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    // const { title, uploadUrl } = input;
    const { title, firstName, uploadUrl, name, size, type, key } = input;

    const userId = session.user.id;

    return prisma.notice.create({
      data: {
        title,
        firstName,
        document: {
          create: {
            uploadUrl,
            name,
            size,
            type,
            key,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
});
