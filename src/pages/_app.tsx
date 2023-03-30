import type { ReactElement, ReactNode, FC } from 'react';
import '@total-typescript/ts-reset';
import type { NextPage } from 'next';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../utils/trpc';
import '../styles/globals.css';
import { Inter as createInter } from '@next/font/google';

const inter = createInter({ subsets: ['latin'] });

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = {
  Component: NextPageWithLayout;
  pageProps: {
    session: Session | null;
  };
};

const MyApp: FC<AppPropsWithLayout> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      {getLayout(
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
