import SettingsLayout from '../../components/SettingsLayout';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';
import type { RouterOutputs } from '../../utils/trpc';
import { trpc } from '../../utils/trpc';
import { z } from 'zod';
import useModal from '../../utils/useModal';
import OrganisationModal from '../../components/modals/OrganisationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const organisationSettingsSchema = z.object({
  name: z.string().optional(),
  streetAddress: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
});

type OrganisationByIdOutput = RouterOutputs['organisation']['byId'];

type OrganisationSettingsSchema = z.infer<typeof organisationSettingsSchema> &
  OrganisationByIdOutput;

const Organisation: NextPageWithLayout<OrganisationSettingsSchema> = () => {
  const { data: sessionData } = useSession();
  const { isShowing, toggle } = useModal();
  const cancelButtonRef = useRef(null);

  const { data: organisation, isLoading: isFetching } =
    trpc.organisation.byId.useQuery({
      id: sessionData?.user.organisationId,
    });

  return (
    <>
      <OrganisationModal
        isShowing={isShowing}
        hide={toggle}
        cancelButtonRef={cancelButtonRef}
        organisation={organisation}
      />

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
          <LoadingSpinner />
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
                  organisation.streetAddress
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
                    organisation.suburb
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
                    organisation.state
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
                    organisation.postcode
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
