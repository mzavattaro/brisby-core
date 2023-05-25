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

type OrganisationModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  organisation:
    | {
        name: string;
        streetAddress: string | null;
        suburb: string | null;
        state: string | null;
        postcode: string | null;
      }
    | undefined;
};

const changeOrganisationSchema = z.object({
  name: z.string().optional(),
  streetAddress: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
});

type OrganisationByIdOutput = RouterOutputs['organisation']['byId'];

type ChangeOrganisationSchema = z.infer<typeof changeOrganisationSchema> &
  OrganisationByIdOutput;

const OrganisationModal: FC<OrganisationModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  organisation,
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = trpc.organisation.update.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([['organisation'], data.id], data);
      await queryClient.invalidateQueries();
    },
  });

  const { register, handleSubmit } = useForm<ChangeOrganisationSchema>({
    resolver: zodResolver(changeOrganisationSchema),
  });

  const onSubmit: SubmitHandler<ChangeOrganisationSchema> = async (data) => {
    const { streetAddress, suburb, state, postcode, name } = data;

    try {
      await mutateAsync({
        name,
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
  };

  return (
    <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid max-w-7xl grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
          <h2 className="col-span-1 text-lg font-semibold sm:col-span-12">
            Organisation information
          </h2>

          {/* Company or organisation */}
          <label className="-mt-6 block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
            Company or organisastion
            <input
              className={classNames(
                'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
              )}
              type="text"
              id="name"
              defaultValue={organisation?.name ?? ''}
              {...register('name')}
            />
          </label>

          {/* Street address */}
          <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
            Street address
            <input
              className={classNames(
                'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm'
              )}
              type="text"
              id="streetAddress"
              defaultValue={organisation?.streetAddress ?? ''}
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
              defaultValue={organisation?.suburb ?? ''}
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
              defaultValue={organisation?.state ?? ''}
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
              defaultValue={organisation?.postcode ?? ''}
              {...register('postcode')}
              autoComplete="postal-code"
            />
          </label>
        </div>

        <div className="col-span-1 mt-6 flex justify-end sm:col-span-2">
          <button
            type="button"
            className="mr-4 inline-flex w-fit justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={hide}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={hide}
            className={classNames(
              'flex w-fit justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 pl-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            type="submit"
          >
            {isLoading ? <span>Saving...</span> : <span>Save</span>}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OrganisationModal;
