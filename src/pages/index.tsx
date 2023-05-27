import { type NextPage } from 'next';
import Head from 'next/head';
import SignInButton from '../components/SignInButton';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Brisby</title>
      <meta name="description" content="Brisby app for Strata Titles" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <SignInButton />
    </main>
  </>
);

export default Home;
