import SettingsLayout from '../../components/SettingsLayout';
import { useQueryClient } from '@tanstack/react-query';
import type { RouterOutputs } from '../../utils/trpc';
import { trpc } from '../../utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import Modal from '../../components/Modal';
import { classNames } from '../../utils/classNames';

const billingSettingsSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }).optional(),
  phone: z.string().min(1, { message: 'Phone is required' }).optional(),
  email: z.string().min(1, { message: 'Email is required' }).optional(),
  streetAddress: z
    .string()
    .min(1, { message: 'Street address is required' })
    .optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }).optional(),
  state: z.string().min(1, { message: 'State is required' }).optional(),
  postcode: z.string().min(1, { message: 'Postcode is required' }).optional(),
});

type OrganisationBillingOutput = RouterOutputs['organisation'];

type BillingSettingsSchema = z.infer<typeof billingSettingsSchema> &
  OrganisationBillingOutput;

const Billing: NextPageWithLayout<BillingSettingsSchema> = () => {
  const queryClient = useQueryClient();

  const [
    isShowingBillingInformationModal,
    setIsShowingBillingInformationModal,
  ] = useState(false);
  const [isShowingBillingAddressModal, setIsShowingBillingAddressModal] =
    useState(false);
  const cancelButtonRef = useRef(null);

  const { data: billing, isLoading: isLoadingBilling } =
    trpc.organisation.getBilling.useQuery();

  // create new billing details
  const { mutateAsync: createMutateAsync, isLoading: isCreating } =
    trpc.billing.create.useMutation({
      onSuccess: async (data) => {
        queryClient.setQueryData([['billing'], data?.id], data);
        try {
          await queryClient.invalidateQueries();
        } catch (error) {
          if (error instanceof Error) {
            // eslint-disable-next-line no-console
            console.log(error.message);
          }
        }
      },
    });

  // update existing billing details
  const { mutateAsync: updateMutateAsync, isLoading: isUpdating } =
    trpc.billing.update.useMutation({
      onSuccess: async (data) => {
        queryClient.setQueryData([['billing'], data?.id], data);
        try {
          await queryClient.invalidateQueries();
        } catch (error) {
          if (error instanceof Error) {
            // eslint-disable-next-line no-console
            console.log(error.message);
          }
        }
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingSettingsSchema>({
    resolver: zodResolver(billingSettingsSchema),
  });

  const toggleBillingInformationModal = () => {
    setIsShowingBillingInformationModal(!isShowingBillingInformationModal);
  };

  const toggleBillingAddressModal = () => {
    setIsShowingBillingAddressModal(!isShowingBillingAddressModal);
  };

  const updateOrCreateBilling = async (data: BillingSettingsSchema) => {
    const { fullName, email, phone, streetAddress, suburb, state, postcode } =
      data;

    try {
      billingSettingsSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
      return;
    }

    if (billing?.id) {
      try {
        await updateMutateAsync({
          id: billing.id,
          fullName,
          email,
          phone,
          streetAddress,
          suburb,
          state,
          postcode,
        });
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.log(error.message);
        }
      }
    } else {
      try {
        await createMutateAsync({
          fullName,
          email,
          phone,
          streetAddress,
          suburb,
          state,
          postcode,
        });
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.log(error.message);
        }
      }
    }
  };

  const onSubmitBillingInformationChange: SubmitHandler<
    BillingSettingsSchema
  > = async (data) => {
    try {
      await updateOrCreateBilling(data);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
    setIsShowingBillingInformationModal(!isShowingBillingInformationModal);
  };

  const onSubmitBillingAddressChange: SubmitHandler<
    BillingSettingsSchema
  > = async (data) => {
    try {
      await updateOrCreateBilling(data);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
    setIsShowingBillingAddressModal(!isShowingBillingAddressModal);
  };

  return (
    <>
      {/* Billing information */}
      <Modal
        isShowing={isShowingBillingInformationModal}
        hide={toggleBillingInformationModal}
        cancelButtonRef={cancelButtonRef}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Change billing information
        </h3>
        <div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Update your billing information.
            </p>
            <form onSubmit={handleSubmit(onSubmitBillingInformationChange)}>
              <label
                className="mt-4 block text-left text-sm font-semibold text-gray-900"
                htmlFor="Name"
              >
                Full name
                <input
                  className={classNames(
                    'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                    errors.fullName
                      ? 'bg-rose-100 focus:border-rose-500 focus:ring-rose-500'
                      : 'focus:border-blue-600 focus:ring-blue-600'
                  )}
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  defaultValue={billing?.fullName ?? ''}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="absolute text-xs italic text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </label>
              <div className="flex flex-col place-content-between sm:flex-row">
                <label
                  className="mt-4 block text-left text-sm font-semibold text-gray-900"
                  htmlFor="Phone"
                >
                  Phone
                  <input
                    className={classNames(
                      'mt-1 block h-10 w-56 appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                      errors.phone
                        ? 'bg-rose-100 focus:border-rose-500 focus:ring-rose-500'
                        : 'focus:border-blue-600 focus:ring-blue-600'
                    )}
                    id="phone"
                    type="text"
                    {...register('phone')}
                    defaultValue={billing?.phone ?? ''}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="absolute text-xs italic text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </label>
                <label
                  className="mt-4 block text-left text-sm font-semibold text-gray-900"
                  htmlFor="Email"
                >
                  Email
                  <input
                    className={classNames(
                      'mt-1 block h-10 w-56 appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                      errors.email
                        ? 'bg-rose-100 focus:border-rose-500 focus:ring-rose-500'
                        : 'focus:border-blue-600 focus:ring-blue-600'
                    )}
                    id="email"
                    type="email"
                    {...register('email')}
                    defaultValue={billing?.email ?? ''}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="absolute text-xs italic text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </label>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className={classNames(
                    'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                    (isCreating || isUpdating) &&
                      'cursor-not-allowed opacity-50'
                  )}
                >
                  {isCreating || isUpdating ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={toggleBillingInformationModal}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Billing address */}
      <Modal
        isShowing={isShowingBillingAddressModal}
        hide={toggleBillingAddressModal}
        cancelButtonRef={cancelButtonRef}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Change billing address
        </h3>
        <div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Update your billing address.
            </p>
            <form onSubmit={handleSubmit(onSubmitBillingAddressChange)}>
              <div className="mt-4 grid max-w-7xl grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
                {/* Street address */}
                <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
                  Street address
                  <input
                    className={classNames(
                      'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
                    )}
                    type="text"
                    id="streetAddress"
                    defaultValue={billing?.streetAddress ?? ''}
                    {...register('streetAddress')}
                    autoComplete="street-address"
                  />
                </label>

                {/* Suburb */}
                <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
                  Suburb
                  <input
                    className={classNames(
                      'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
                    )}
                    type="text"
                    id="suburb"
                    defaultValue={billing?.suburb ?? ''}
                    {...register('suburb')}
                  />
                </label>

                {/* State */}
                <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
                  State
                  <select
                    className={classNames(
                      'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
                    )}
                    id="state"
                    {...register('state')}
                    defaultValue={billing?.state ?? ''}
                  >
                    {['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'].map(
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
                      'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
                    )}
                    type="text"
                    id="postcode"
                    defaultValue={billing?.postcode ?? ''}
                    {...register('postcode')}
                    autoComplete="postal-code"
                  />
                </label>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className={classNames(
                    'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                    (isCreating || isUpdating) &&
                      'cursor-not-allowed opacity-50'
                  )}
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={toggleBillingAddressModal}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

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
        <span>Loading...</span>
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
                <div className="my-6 sm:my-0 sm:mx-18">
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
