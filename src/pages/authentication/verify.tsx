import Link from 'next/link';
import type { FC } from 'react';

const Verify: FC = () => (
  <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
    <div className="text-center">
      <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
      <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
        Check your email
      </h2>
    </div>
    <div className="mt-2 px-4 sm:px-10">
      <p className="font-base text-lg">
        Please check your <b>inbox for your sign in link.</b>
      </p>
      <p className="mt-2 text-base">Sometimes this can land in spam.</p>
      <div className="mt-10 text-lg text-gray-400 underline hover:text-gray-900">
        <Link href="http://localhost:3000/">
          <p>back to homepage</p>
        </Link>
      </div>
    </div>
  </div>
);

export default Verify;
