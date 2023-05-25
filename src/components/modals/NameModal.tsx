import React from 'react';
import type { FC } from 'react';
import Modal from '../Modal';
import { classNames } from '../../utils/classNames';
import { useQueryClient } from '@tanstack/react-query';
import type { RouterOutputs } from '../../utils/trpc';
import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';

type NameModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  setIsShowingNameModal: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | '';
};

const changeNameSchema = z.object({
  name: z.string().optional(),
});

type UserByIdOutput = RouterOutputs['user']['byId'];

type ChangeNameSchema = z.infer<typeof changeNameSchema> & UserByIdOutput;

const NameModal: FC<NameModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  setIsShowingNameModal,
  userName,
}) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<ChangeNameSchema>({
    resolver: zodResolver(changeNameSchema),
  });

  const { mutateAsync, isLoading } = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([['user'], data.id], data);
      await queryClient.invalidateQueries();
    },
  });

  const onSubmitNameChange: SubmitHandler<ChangeNameSchema> = async (data) => {
    const { name } = data;

    try {
      await mutateAsync({
        data: {
          name,
        },
      });
      setIsShowingNameModal(!isShowing);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
  };

  return (
    <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Change name
      </h3>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Enter your new name.</p>
          <form onSubmit={handleSubmit(onSubmitNameChange)}>
            <label
              className="mt-4 block text-left text-sm font-semibold text-gray-900"
              htmlFor="Name"
            >
              New name
              <input
                className="mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm"
                id="name"
                type="text"
                defaultValue={userName}
                {...register('name')}
                autoComplete="name"
              />
            </label>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className={classNames(
                  'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                  isLoading && 'cursor-not-allowed opacity-50'
                )}
                disabled={isLoading}
              >
                {isLoading ? <span>Updating...</span> : <span>Update</span>}
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

export default NameModal;
