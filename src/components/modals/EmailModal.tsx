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

type EmailModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  setIsShowingEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const changeEmailSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    confirmEmail: z
      .string()
      .email({ message: 'Invalid email address' })
      .optional(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Emails do not match',
    path: ['confirmEmail'],
  });

type UserByIdOutput = RouterOutputs['user']['byId'];

type ChangeEmailSchema = z.infer<typeof changeEmailSchema> & UserByIdOutput;

const EmailModal: FC<EmailModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  setIsShowingEmailModal,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
  });

  const {
    mutateAsync,
    isLoading,
    error: apiError,
  } = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([['user'], data.id], data);
      await queryClient.invalidateQueries();
    },
  });

  const onSubmitEmailChange: SubmitHandler<ChangeEmailSchema> = async (
    data
  ) => {
    const { email } = data;

    try {
      await mutateAsync({
        data: {
          email,
        },
      });
      setIsShowingEmailModal(!isShowing);
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
        Change email address
      </h3>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Enter your new email address.</p>
          <form onSubmit={handleSubmit(onSubmitEmailChange)}>
            <label
              className="mt-4 block text-left text-sm font-semibold text-gray-900"
              htmlFor="Email"
            >
              New email
              <input
                id="email"
                type="email"
                {...register('email')}
                autoComplete="email"
                className={classNames(
                  'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                  errors.email
                    ? 'bg-rose-50 focus:border-rose-500 focus:ring-rose-500'
                    : 'focus:border-blue-600 focus:ring-blue-600'
                )}
              />
              <div className="absolute max-w-xl">
                {errors.email && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </label>

            {/* Confirm email */}
            <label
              className="mt-6 block text-left text-sm font-semibold text-gray-900"
              htmlFor="Confirm email"
            >
              Confirm new email
              <input
                id="confirmEmail"
                type="email"
                {...register('confirmEmail')}
                className={classNames(
                  'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                  errors.confirmEmail
                    ? 'bg-rose-50 focus:border-rose-500 focus:ring-rose-500'
                    : 'focus:border-blue-600 focus:ring-blue-600'
                )}
              />
              <div className="absolute max-w-xl">
                {errors.confirmEmail && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {errors.confirmEmail.message}
                  </p>
                )}
              </div>
              <div className="absolute max-w-xl">
                {apiError && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    An account with that email already exists
                  </p>
                )}
              </div>
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

export default EmailModal;
