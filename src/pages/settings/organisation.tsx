import SettingsLayout from "../../components/SettingsLayout";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import useModal from "../../utils/useModal";
import Modal from "../../components/Modal";

const organisationSettingsSchema = z.object({
  name: z.string().optional(),
  streetAddress: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
});

type OrganisationByIdOutput = RouterOutputs["organisation"]["byId"];

type OrganisationSettingsSchema = z.infer<typeof organisationSettingsSchema> &
  OrganisationByIdOutput;

const Organisation: NextPageWithLayout<OrganisationSettingsSchema> = () => {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const { isShowing, toggle } = useModal();
  const cancelButtonRef = useRef(null);

  const { data: organisation, isLoading: isFetching } =
    trpc.organisation.byId.useQuery({
      id: sessionData?.user?.organisationId,
    });

  const { mutateAsync, isLoading } = trpc.organisation.update.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([["organisation"], data.id], data);

      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
      toggle();
    },
  });

  const { register, handleSubmit } = useForm<OrganisationSettingsSchema>({
    resolver: zodResolver(organisationSettingsSchema),
  });

  const onSubmit: SubmitHandler<OrganisationSettingsSchema> = async (data) => {
    const { streetAddress, suburb, state, postcode, name } = data;

    try {
      await mutateAsync({
        name: name,
        streetAddress: streetAddress,
        suburb: suburb,
        state: state,
        postcode: postcode,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        cancelButtonRef={cancelButtonRef}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid max-w-7xl grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
            <h2 className="col-span-1 text-lg font-semibold sm:col-span-12">
              Organisation information
            </h2>

            {/* Company or organisation */}
            <label className="-mt-6 block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
              Company or organisastion
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="name"
                defaultValue={organisation?.name}
                {...register("name")}
              />
            </label>

            {/* Street address */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
              Street address
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="streetAddress"
                defaultValue={organisation?.streetAddress ?? ""}
                {...register("streetAddress")}
                autoComplete="street-address"
              />
            </label>

            {/* Suburb */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              Suburb
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="suburb"
                defaultValue={organisation?.suburb ?? ""}
                {...register("suburb")}
              />
            </label>

            {/* State */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              State
              <select
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                id="state"
                {...register("state")}
                defaultValue={organisation?.state ?? ""}
              >
                {["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(
                  (state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  )
                )}
              </select>
            </label>

            {/* Postcode */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              Postcode
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="postcode"
                defaultValue={organisation?.postcode ?? ""}
                {...register("postcode")}
                autoComplete="postal-code"
              />
            </label>
          </div>

          <div className="col-span-1 mt-6 flex justify-end sm:col-span-2">
            <button
              type="button"
              className="mr-4 inline-flex w-fit justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={toggle}
              ref={cancelButtonRef}
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              className={classNames(
                "flex w-fit justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 pl-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isLoading && "cursor-not-allowed opacity-50"
              )}
              type="submit"
            >
              {isLoading ? <span>Saving...</span> : <span>Save</span>}
            </button>
          </div>
        </form>
      </Modal>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">
            Organisation settings
          </h1>
        </div>

        <div className="col-span-1 sm:col-span-12">
          <p className="text-gray-500">
            These settings control your organisastion&apos;s or company&apos;s
            information.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl px-2 sm:px-6 md:px-8">
        <h2 className="text-lg font-semibold">Organisation information</h2>
        {isFetching ? (
          <span>Loading...</span>
        ) : (
          <div className="flex flex-col">
            {/* Name */}
            <div>
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Name
              </h4>
              <p className="w-fit text-gray-500">{organisation?.name}</p>
            </div>

            {/* Street address */}
            <div className="mt-6">
              <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                Street address
              </h4>
              <div className="w-fit text-gray-500">
                {organisation?.streetAddress ? (
                  organisation?.streetAddress
                ) : (
                  <p className="italic">Add street address</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row">
              {/* Suburb */}
              <div>
                <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                  Suburb
                </h4>
                <div className="w-fit text-gray-500">
                  {organisation?.suburb ? (
                    organisation?.suburb
                  ) : (
                    <p className="italic">Add suburb</p>
                  )}
                </div>
              </div>
              {/* State */}
              <div className="my-6 sm:mx-18 sm:my-0">
                <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                  State
                </h4>
                <div className="w-fit text-gray-500">
                  {organisation?.state ? (
                    organisation?.state
                  ) : (
                    <p className="italic">Add state</p>
                  )}
                </div>
              </div>
              {/* Postcode */}
              <div>
                <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
                  Postcode
                </h4>
                <div className="w-fit text-gray-500">
                  {organisation?.postcode ? (
                    organisation?.postcode
                  ) : (
                    <p className="italic">Add postcode</p>
                  )}
                </div>
              </div>
            </div>

            <button
              id="changeOrganisation"
              className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
              type="button"
              onClick={toggle}
              name="changeOrganisation"
            >
              change
            </button>
          </div>
        )}
      </div>
    </>
  );
};

Organisation.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Organisation;
