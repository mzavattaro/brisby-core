import SettingsLayout from '../../components/SettingsLayout';
import { trpc } from '../../utils/trpc';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import BillingAddressModal from '../../components/modals/BillingAddressModal';
import BillingInformationModal from '../../components/modals/BillingInformationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const Billing: NextPageWithLayout = () => {
  const [
    isShowingBillingInformationModal,
    setIsShowingBillingInformationModal,
  ] = useState(false);
  const [isShowingBillingAddressModal, setIsShowingBillingAddressModal] =
    useState(false);
  const cancelButtonRef = useRef(null);

  const { data: billing, isLoading: isLoadingBilling } =
    trpc.organisation.getBilling.useQuery();

  const toggleBillingInformationModal = () => {
    setIsShowingBillingInformationModal(!isShowingBillingInformationModal);
  };

  const toggleBillingAddressModal = () => {
    setIsShowingBillingAddressModal(!isShowingBillingAddressModal);
  };

  return (
    <>
      <BillingInformationModal
        isShowing={isShowingBillingInformationModal}
        hide={toggleBillingInformationModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingBillingInformationModal={
          setIsShowingBillingInformationModal
        }
        billing={billing}
      />

      <BillingAddressModal
        isShowing={isShowingBillingAddressModal}
        hide={toggleBillingAddressModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingBillingAddressModal={setIsShowingBillingAddressModal}
        billing={billing}
      />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
        </div>

        <div className="col-span-1 sm:col-span-12">
          <p className="text-gray-500">
            View and update your payment and billing information.
          </p>
        </div>
      </div>
      {isLoadingBilling ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Billing information */}
          <div className="mx-auto mt-4 max-w-4xl px-2 sm:px-6 md:px-8">
            <h2 className="text-lg font-semibold">Billing information</h2>

            <div className="flex flex-col border-b pb-10">
              {/* Name */}
              <div>
                <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                  Full name
                </h4>
                <div className="w-fit text-gray-500">
                  {billing?.fullName ? (
                    billing.fullName
                  ) : (
                    <div className="italic">Add name</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row">
                {/* Phone */}
                <div>
                  <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                    Phone
                  </h4>
                  <div className="w-fit text-gray-500">
                    {billing?.phone ? (
                      billing.phone
                    ) : (
                      <div className="italic">Add phone number</div>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div className=" mt-6 sm:mx-18 sm:mt-0">
                  <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                    Email
                  </h4>
                  <div className="w-fit text-gray-500">
                    {' '}
                    {billing?.email ? (
                      billing.email
                    ) : (
                      <div className="italic">Add email</div>
                    )}
                  </div>
                </div>
              </div>

              <button
                id="changeBillingInformation"
                className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
                type="button"
                onClick={toggleBillingInformationModal}
                name="changeBillingInformation"
              >
                change
              </button>
            </div>
          </div>

          {/* Billing address */}
          <div className="mx-auto max-w-4xl px-2 pt-10 sm:px-6 md:px-8">
            <h2 className="text-lg font-semibold">Billing address</h2>
            <div className="flex flex-col">
              {/* Street address */}

              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Street address
              </h4>
              <div className="w-fit text-gray-500">
                {' '}
                {billing?.streetAddress ? (
                  billing.streetAddress
                ) : (
                  <div className="italic">Add street address</div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row">
                {/* Suburb */}
                <div>
                  <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                    Suburb
                  </h4>
                  <div className="w-fit text-gray-500">
                    {' '}
                    {billing?.suburb ? (
                      billing.suburb
                    ) : (
                      <div className="italic">Add suburb</div>
                    )}
                  </div>
                </div>
                {/* State */}
                <div className="my-6 sm:mx-18 sm:my-0">
                  <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                    State
                  </h4>
                  <div className="w-fit text-gray-500">
                    {' '}
                    {billing?.state ? (
                      billing.state
                    ) : (
                      <div className="italic">Add state</div>
                    )}
                  </div>
                </div>
                {/* Postcode */}
                <div>
                  <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                    Postcode
                  </h4>
                  <div className="w-fit text-gray-500">
                    {' '}
                    {billing?.postcode ? (
                      billing.postcode
                    ) : (
                      <div className="italic">Add postcode</div>
                    )}
                  </div>
                </div>
              </div>

              <button
                id="changeBillingAddress"
                className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
                type="button"
                onClick={toggleBillingAddressModal}
                name="changeBillingAddress"
              >
                change
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

Billing.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Billing;
