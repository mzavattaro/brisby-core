import type { RouterOutputs } from '../../utils/trpc';
import { getCsrfToken } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { classNames } from '../../utils/classNames';
import Email from '../../../icons/Email';
import type { FC } from 'react';
import type { GetServerSideProps } from 'next';

const signInSchema = z.object({
  csrfToken: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
});

type SignInSchema = z.infer<typeof signInSchema> & {
  UserEmailOutput: RouterOutputs['user']['byEmail'];
};

const SignIn: FC<SignInSchema> = ({ csrfToken }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    console.log('Client No stringify', data);
    console.log('Client Stringify', JSON.stringify(data));

    try {
      await fetch('/api/signinHandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    try {
      await router.push('/authentication/verify');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Create or sign into your account
        </h2>
        <p className="mt-2 text-lg text-gray-900">
          We suggest using the <b>email address that you use at work.</b>
        </p>
      </div>
      <div className="mt-6 sm:mx-10">
        <form method="post" action="/api/auth/signin/email">
          <input
            type="hidden"
            defaultValue={csrfToken}
            {...register('csrfToken', { required: true })}
          />
          <label className="block text-left text-sm font-semibold text-gray-900">
            Email address
            <input
              className={classNames(
                'mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm',
                errors.email
                  ? 'bg-rose-50 focus:border-rose-500 focus:ring-rose-500'
                  : 'focus:border-blue-600 focus:ring-blue-600'
              )}
              type="text"
              id="email"
              placeholder="you@company.com"
              {...register('email', { required: true })}
            />
            <div className="absolute max-w-xl">
              {errors.email && (
                <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                  {' '}
                  {errors.email.message}
                </p>
              )}
            </div>
          </label>
          <button
            disabled={isSubmitting}
            className={classNames(
              'mt-10 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              isSubmitting && 'cursor-not-allowed opacity-50'
            )}
            type="submit"
          >
            {isSubmitting ? <span>Signing in...</span> : <span>Continue</span>}
          </button>
        </form>
        <div className="mt-6 flex h-14 items-center rounded bg-zinc-200 px-4 text-left text-xs sm:text-sm">
          <Email />
          <p className="ml-2">
            We will email you a magic link for a password-free sign in
            experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};
