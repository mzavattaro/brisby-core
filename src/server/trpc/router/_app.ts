import { router } from "../trpc";
import { authRouter } from "./auth";
import { noticeRouter } from "./notice";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  notice: noticeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
