import { noticeSchema } from "../../../pages/noticeboard/new";
import { protectedProcedure, router } from "../trpc";

export const noticeRouter = router({
  // create /api/notice
  create: protectedProcedure.input(noticeSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    // const { title, uploadUrl } = input;
    const { title, firstName } = input;

    const userId = session.user.id;

    return prisma.notice.create({
      data: {
        title,
        firstName,
        author: {
          connect: {
            id: userId,
          },
        },
        // document: {
        //   create: {
        //     uploadUrl,
        //   },
        // },
      },
      // include: {
      //   document: true,
      // },
    });
  }),
});
