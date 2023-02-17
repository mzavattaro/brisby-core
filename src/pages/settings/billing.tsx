import SettingsLayout from "../../components/SettingsLayout";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const billingSettingsSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
});

type OrganisationBillingOutput = RouterOutputs["organisation"]["billing"];

type OrganisationSettingsSchema = z.infer<typeof billingSettingsSchema> &
  OrganisationBillingOutput;

const Billing: NextPageWithLayout<OrganisationSettingsSchema> = () => {
  const { data: billing, isLoading: isFetching } =
    trpc.organisation.billing.useQuery();

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
            <div className="w-fit text-gray-500">
              {billing?.fullName ? (
                billing?.fullName
              ) : (
                <div className="italic">Add suburb</div>
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
                  billing?.phone
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
                {" "}
                {billing?.email ? (
                  billing?.email
                ) : (
                  <div className="italic">Add email</div>
                )}
              </div>
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
          <div className="w-fit text-gray-500">
            {" "}
            {billing?.streetAddress ? (
              billing?.streetAddress
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
                {" "}
                {billing?.suburb ? (
                  billing?.suburb
                ) : (
                  <div className="italic">Add suburb</div>
                )}
              </div>
            </div>
            {/* State */}
            <div className="my-6 sm:my-0 sm:mx-18">
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                State
              </h4>
              <div className="w-fit text-gray-500">
                {" "}
                {billing?.state ? (
                  billing?.state
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
                {" "}
                {billing?.postcode ? (
                  billing?.postcode
                ) : (
                  <div className="italic">Add postcode</div>
                )}
              </div>
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
