import { router } from "../trpc";
import { authRouter } from "./auth";
import { noticeRouter } from "./notice";
import { organisationRouter } from "./organisation";
import { billingRouter } from "./billing";
import { buildingComplexRouter } from "./buildingComplex";
import { userRouter } from "./user";

export const appRouter = router({
  billing: billingRouter,
  organisation: organisationRouter,
  buildingComplex: buildingComplexRouter,
  user: userRouter,
  notice: noticeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
