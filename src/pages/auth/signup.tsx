import { getCsrfToken } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { classNames } from "../../utils/classNames";
import Email from "../../../public/Email";
import Link from "next/link";

const signUpSchema = z.object({
  csrfToken: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  organisation: z
    .string()
    .min(1, { message: "Company or organisation is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUp: React.FC<SignUpSchema> = ({ csrfToken }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    try {
      await axios.post("/api/auth/signin/email", data);
      router.push("/auth/verify-request");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="mx-4 mt-8 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
          <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            Let's create your new account
          </h2>
          <p className="mt-6 text-xl text-gray-900">
            We suggest using the <b>email address that you use at work.</b>
          </p>
        </div>
        <div className="mt-8 sm:mx-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={csrfToken}
              {...register("csrfToken", { required: true })}
            />
            <div className="flex w-full flex-col justify-between sm:flex-row">
              {/* First name */}
              <label className="block w-full text-left text-sm font-semibold text-gray-900 sm:w-72">
                First name
                <input
                  className={classNames(
                    "mt-1 block h-12 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                    errors.firstName
                      ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                      : "focus:border-blue-600 focus:ring-blue-600"
                  )}
                  type="text"
                  id="firstName"
                  placeholder="Joe"
                  {...register("firstName", { required: true })}
                />
                <div className="absolute max-w-xl">
                  {errors.firstName && (
                    <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                      {" "}
                      {errors.firstName?.message}
                    </p>
                  )}
                </div>
              </label>
              {/* Last name */}
              <label className="text-gray-90 mt-8 block w-full text-left text-sm font-semibold sm:mt-0 sm:w-72">
                Last name
                <input
                  className={classNames(
                    "mt-1 block h-12 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                    errors.lastName
                      ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                      : "focus:border-blue-600 focus:ring-blue-600"
                  )}
                  type="text"
                  id="lastName"
                  placeholder="Bloggs"
                  {...register("lastName", { required: true })}
                />
                <div className="absolute max-w-xl">
                  {errors.lastName && (
                    <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                      {" "}
                      {errors.lastName?.message}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* Organisation */}
            <label className="mt-8 block text-left text-sm font-semibold text-gray-900">
              Company or organisation
              <input
                className={classNames(
                  "mt-1 block h-12 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                  errors.organisation
                    ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                    : "focus:border-blue-600 focus:ring-blue-600"
                )}
                type="text"
                id="organisation"
                placeholder="Acme Inc."
                {...register("organisation", { required: true })}
              />
              <div className="absolute max-w-xl">
                {errors.organisation && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {" "}
                    {errors.organisation?.message}
                  </p>
                )}
              </div>
            </label>

            {/* Email */}
            <label className="mt-8 block text-left text-sm font-semibold text-gray-900">
              Email address
              <input
                className={classNames(
                  "mt-1 block h-12 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                  errors.email
                    ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                    : "focus:border-blue-600 focus:ring-blue-600"
                )}
                type="text"
                id="email"
                placeholder="you@company.com"
                {...register("email", { required: true })}
              />
              <div className="absolute max-w-xl">
                {errors.email && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {" "}
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </label>
            <button
              disabled={isSubmitting}
              className={classNames(
                "mt-13 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-26",
                isSubmitting && "cursor-not-allowed opacity-50"
              )}
              type="submit"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>
          <div className="mt-6 flex h-14 items-center rounded bg-zinc-200 px-4 text-left text-xs sm:text-sm">
            <Email />
            <p className="ml-2">
              We'll email you a magic link for a password-free sign up
              experience.
            </p>
          </div>
          <div className="mt-1 text-xs sm:text-sm">
            <p>
              Already have a Brisby account? You can{" "}
              <Link
                href={"/auth/sign-in"}
                className="font-bold text-indigo-600 hover:underline"
              >
                sign in here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
