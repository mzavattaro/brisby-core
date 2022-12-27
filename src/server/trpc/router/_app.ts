import { router } from "../trpc";
import { authRouter } from "./auth";
import { noticeRouter } from "./notice";
import { documentRouter } from "./document";

export const appRouter = router({
  notice: noticeRouter,
  document: documentRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
