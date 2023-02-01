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

const signInSchema = z.object({
  csrfToken: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn: React.FC<SignInSchema> = ({ csrfToken }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    try {
      await axios.post("/api/auth/signin/email", data);
      router.push("/auth/verify-request");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="mx-4 mt-8 text-center sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
          <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            Sign into your account
          </h2>
          <p className="mt-6 text-xl text-gray-900">
            Sign in with your existing email address
          </p>
        </div>
        <div className="mt-10 sm:mx-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={csrfToken}
              {...register("csrfToken", { required: true })}
            />
            <label className="block text-left text-sm font-semibold text-gray-900">
              Email address
              <input
                className={classNames(
                  "mt-1 block h-12 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                  errors.email
                    ? "focus:border-rose-500 focus:ring-rose-500"
                    : "focus:border-blue-600 focus:ring-blue-600"
                )}
                type="text"
                id="email"
                placeholder="you@company.com"
                {...register("email", { required: true })}
              />
              <div className="absolute max-w-xl">
                {errors.email && (
                  <p className="mt-2 h-10 text-sm font-bold text-rose-500">
                    {" "}
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </label>
            <button
              disabled={isSubmitting}
              className={classNames(
                "mt-20 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
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
              We'll email you a magic link for a password-free sign in
              experience.
            </p>
          </div>
          <div className="mt-2 text-xs sm:text-sm">
            <p>
              Need to create an accrount? You can can{" "}
              <Link
                href={"/"}
                className="font-bold text-indigo-600 hover:underline"
              >
                sign up here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
