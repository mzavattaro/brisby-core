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

type BillingAddressModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  setIsShowingBillingAddressModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  billing: Billing | null | undefined;
};

const changeBillingAddressSchema = z.object({
  streetAddress: z
    .string()
    .min(1, { message: 'Street address is required' })
    .optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }).optional(),
  state: z.string().min(1, { message: 'State is required' }).optional(),
  postcode: z.string().min(1, { message: 'Postcode is required' }).optional(),
});

type OrganisationBillingOutput = RouterOutputs['organisation'];

type ChangeBillingAddressSchema = z.infer<typeof changeBillingAddressSchema> &
  OrganisationBillingOutput;

const BillingAddressModal: FC<BillingAddressModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  setIsShowingBillingAddressModal,
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

  const { register, handleSubmit } = useForm<ChangeBillingAddressSchema>({
    resolver: zodResolver(changeBillingAddressSchema),
  });

  const updateOrCreateBilling = async (data: ChangeBillingAddressSchema) => {
    const { streetAddress, suburb, state, postcode } = data;

    try {
      changeBillingAddressSchema.parse(data);
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

  const onSubmitBillingAddressChange: SubmitHandler<
    ChangeBillingAddressSchema
  > = async (data) => {
    try {
      await updateOrCreateBilling(data);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
    setIsShowingBillingAddressModal(!hide);
  };

  return (
    <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Change billing address
      </h3>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Update your billing address.</p>
          <form onSubmit={handleSubmit(onSubmitBillingAddressChange)}>
            <div className="mt-4 grid max-w-7xl grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
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
                  (isCreating || isUpdating) && 'cursor-not-allowed opacity-50'
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
