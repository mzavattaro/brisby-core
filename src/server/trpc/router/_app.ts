import { router } from "../trpc";
import { authRouter } from "./auth";
import { noticeRouter } from "./notice";

export const appRouter = router({
  notice: noticeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
