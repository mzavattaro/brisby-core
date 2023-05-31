import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { type Context } from './context';

const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const { router } = trpc;

/**
 * Unprotected procedure
 *
 */
export const publicProcedure = trpc.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 *
 */
export const protectedProcedure = trpc.procedure.use(isAuthed);
