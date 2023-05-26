import React from 'react';
import type { FC } from 'react';
import Modal from '../Modal';
import { classNames } from '../../utils/classNames';
import { trpc } from '../../utils/trpc';
import type { RouterOutputs } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import type { Billing } from '@prisma/client';

type BillingInformationModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  setIsShowingBillingInformationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  billing: Billing | null | undefined;
};

const billingInformationSettingsSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }).optional(),
  phone: z.string().min(1, { message: 'Phone is required' }).optional(),
  email: z.string().min(1, { message: 'Email is required' }).optional(),
});

type OrganisationBillingOutput = RouterOutputs['organisation'];

type BillingInformationSettingsSchema = z.infer<
  typeof billingInformationSettingsSchema
> &
  OrganisationBillingOutput;

const BillingAddressModal: FC<BillingInformationModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  setIsShowingBillingInformationModal,
  billing,
}) => {
  const queryClient = useQueryClient();

  // create new billing details
  const { mutateAsync: createMutateAsync, isLoading: isCreating } =
    trpc.billing.create.useMutation({
      onSuccess: async (data) => {
        queryClient.setQueryData([['billing'], data.id], data);
        await queryClient.invalidateQueries();
      },
    });

  // update existing billing details
  const { mutateAsync: updateMutateAsync, isLoading: isUpdating } =
    trpc.billing.update.useMutation({
      onSuccess: async (data) => {
        queryClient.setQueryData([['billing'], data.id], data);
        await queryClient.invalidateQueries();
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingInformationSettingsSchema>({
    resolver: zodResolver(billingInformationSettingsSchema),
  });

  const updateOrCreateBilling = async (
    data: BillingInformationSettingsSchema
  ) => {
    const { fullName, phone, email } = data;

    try {
      billingInformationSettingsSchema.parse(data);
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
          phone,
          email,
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
          phone,
          email,
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
    BillingInformationSettingsSchema
  > = async (data) => {
    try {
      await updateOrCreateBilling(data);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
    setIsShowingBillingInformationModal(!hide);
  };

  return (
    <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
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
                  (isCreating || isUpdating) && 'cursor-not-allowed opacity-50'
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
                onClick={hide}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default BillingAddressModal;
