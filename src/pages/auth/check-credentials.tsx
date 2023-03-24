import type { NextPage } from 'next/types';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CredentialCheck: NextPage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const [calledPush, setCalledPush] = useState<boolean>(false);

  useEffect(() => {
    if (!data) return;

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      status === 'authenticated' &&
      !data.user.name &&
      !data.user.organisationId
    ) {
      if (calledPush) {
        // no need to call router.push() again
        return;
      }
      setTimeout(async () => router.push('/auth/new-user'), 2000);
      // this is a hack to make sure the useEffect() is called after the first render
      setCalledPush(true);
    }

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      status === 'authenticated' &&
      data.user.name &&
      !data.user.organisationId
    ) {
      if (calledPush) {
        // no need to call router.push() again
        return;
      }
      setTimeout(async () => router.push('/auth/new-organisation'), 2000);
      setCalledPush(true);
    }

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      status === 'authenticated' &&
      data.user.name &&
      data.user.organisationId
    ) {
      if (calledPush) {
        // no need to call router.push() again
        return;
      }
      setTimeout(async () => router.push('/auth/building-complexes'), 2000);
      setCalledPush(true);
    }
  }, [calledPush, data, router, status]);

  return (
    <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Checking your sign in credentials...
        </h2>
      </div>
      <div className="mt-2 px-4 sm:px-10">
        <p className="font-base text-lg">
          This should only take a few moments.
        </p>
      </div>
    </div>
  );
};

export default CredentialCheck;
