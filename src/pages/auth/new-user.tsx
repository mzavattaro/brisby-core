import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { classNames } from '../../utils/classNames';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const newUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

type NewUserSchema = z.infer<typeof newUserSchema>;

const NewUser: FC<NewUserSchema> = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: sessionData } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUserSchema>({
    resolver: zodResolver(newUserSchema),
  });

  const { mutateAsync, isLoading } = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([['user'], data.id], data);
      await queryClient.invalidateQueries();
    },
  });

  const onSubmit: SubmitHandler<NewUserSchema> = async (data) => {
    const { name } = data;

    try {
      await mutateAsync({
        data: {
          name,
        },
        id: sessionData?.user.id,
      });
      await router.push('/auth/new-organisation');
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
  };

  return (
    <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="text-center">
        <h4>Step 1 of 3</h4>
        <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Setup your new account
        </h2>
        <p className="mt-2 text-lg text-gray-900">
          You can change these later in your <b>account settings</b>
        </p>
      </div>
      <div className="mt-6 sm:mx-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between sm:flex-row">
            {/* Name */}
            <label className="block w-full text-left text-sm font-semibold text-gray-900">
              Name
              <input
                className={classNames(
                  'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                  errors.name
                    ? 'bg-rose-50 focus:border-rose-500 focus:ring-rose-500'
                    : 'focus:border-blue-600 focus:ring-blue-600'
                )}
                type="text"
                id="firstName"
                placeholder="Joe Bloggs"
                {...register('name', { required: true })}
                autoComplete="name"
              />
              <div className="absolute max-w-xl">
                {errors.name && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {' '}
                    {errors.name.message}
                  </p>
                )}
              </div>
            </label>
          </div>

          <button
            disabled={isLoading}
            className={classNames(
              'mt-10 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-10',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            type="submit"
          >
            {isLoading ? <span>Creating...</span> : <span>Continue</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
