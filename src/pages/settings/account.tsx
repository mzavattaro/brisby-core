import type { ReactElement } from 'react';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import SettingsLayout from '../../components/SettingsLayout';
import type { NextPageWithLayout } from '../_app';
import { trpc } from '../../utils/trpc';
import NameModal from '../../components/modals/NameModal';
import EmailModal from '../../components/modals/EmailModal';

const Account: NextPageWithLayout = () => {
  const [isShowingEmailModal, setIsShowingEmailModal] = useState(false);
  const [isShowingNameModal, setIsShowingNameModal] = useState(false);
  const cancelButtonRef = useRef(null);
  const { data: sessionData } = useSession();

  const { data: user, isLoading: isFetching } = trpc.user.byId.useQuery({
    id: sessionData?.user.id,
  });

  const toggleNameModal = () => {
    setIsShowingNameModal(!isShowingNameModal);
  };

  const toggleEmailModal = () => {
    setIsShowingEmailModal(!isShowingEmailModal);
  };

  return (
    <>
      {/* Name change */}
      <NameModal
        isShowing={isShowingNameModal}
        hide={toggleNameModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingNameModal={setIsShowingNameModal}
        userName={user?.name ?? ''}
      />

      {/* Email change */}
      <EmailModal
        isShowing={isShowingEmailModal}
        hide={toggleEmailModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingEmailModal={setIsShowingEmailModal}
      />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">
            Account settings
          </h1>
        </div>

        <div className="col-span-1 sm:col-span-12">
          <p className="text-gray-500">
            These settings control your personal account information.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl px-2 sm:px-6 md:px-8">
        <h2 className="text-lg font-semibold">Personal information</h2>
        {isFetching ? (
          <span>Loading..</span>
        ) : (
          <div className="flex flex-col">
            {/* Name */}
            <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
              Name
            </h4>
            <p className="w-fit text-gray-500">{user?.name}</p>
            <button
              id="changeName"
              className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
              type="button"
              onClick={toggleNameModal}
              name="changeName"
            >
              change
            </button>

            {/* Email */}
            <h4 className="mt-6 w-fit text-left text-sm font-semibold text-gray-900">
              Email
            </h4>
            <p className="w-fit text-gray-500">{user?.email}</p>
            <button
              id="changeEmail"
              className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
              type="button"
              onClick={toggleEmailModal}
              name="changeEmail"
            >
              change
            </button>
          </div>
        )}
      </div>
    </>
  );
};

Account.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Account;
