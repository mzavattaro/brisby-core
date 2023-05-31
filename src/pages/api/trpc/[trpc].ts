import { createNextApiHandler } from '@trpc/server/adapters/next';
import { env } from '../../../env/server.mjs';
import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/router/_app';

const handler = createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          // eslint-disable-next-line no-console
          console.error(
            `❌ tRPC failed on ${path ?? 'some path'}: ${error.message}`
          );
        }
      : undefined,
});

export default handler;
