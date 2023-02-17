import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const Billing: NextPageWithLayout = () => {
  return (
    <>
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

      <div className="mx-auto mt-4 max-w-4xl px-2 sm:px-6 md:px-8">
        <h2 className="text-lg font-semibold">Billing information</h2>

        <div className="flex flex-col border-b pb-10">
          {/* Name */}
          <div>
            <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
              Full name
            </h4>
            <p className="w-fit text-gray-500">Michael Zavattaro</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row">
            {/* Phone */}
            <div>
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Phone
              </h4>
              <div className="w-fit text-gray-500">0434285386</div>
            </div>
            {/* Email */}
            <div className=" mt-6 sm:mx-18 sm:mt-0">
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Email
              </h4>
              <div className="w-fit text-gray-500">mwzavattaro@gmail.com</div>
            </div>
          </div>

          <button
            id="changeOrganisation"
            className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
            type="button"
            // onClick={toggle}
            name="changeOrganisation"
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
          <div className="w-fit text-gray-500">Street addtress</div>

          <div className="mt-6 flex flex-col sm:flex-row">
            {/* Suburb */}
            <div>
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Suburb
              </h4>
              <div className="w-fit text-gray-500">Suburb</div>
            </div>
            {/* State */}
            <div className="my-6 sm:my-0 sm:mx-18">
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                State
              </h4>
              <div className="w-fit text-gray-500">State</div>
            </div>
            {/* Postcode */}
            <div>
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Postcode
              </h4>
              <div className="w-fit text-gray-500">Postcode</div>
            </div>
          </div>

          <button
            id="changeOrganisation"
            className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
            type="button"
            // onClick={toggle}
            name="changeOrganisation"
          >
            change
          </button>
        </div>
      </div>
    </>
  );
};

Billing.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Billing;
