import type { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => (
  <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
    <div className="text-center">
      <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
      <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
        404 - Page Not Found
      </h2>
    </div>
    <div className="mt-2 px-4 sm:px-10">
      <p className="text-lg font-bold">
        This is not the web page you are looking for.
      </p>
      <p className="mt-2 text-base">
        Don&apos;t worry, you can safely return to the homepage.
      </p>
      <div className="mt-10 text-lg text-gray-400 underline hover:text-gray-900">
        <Link href="http://localhost:3000/">
          <p>back to homepage</p>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
