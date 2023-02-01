import { getCsrfToken } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { classNames } from "../../utils/classNames";

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
            Let's start with your email address
          </h2>
          <p className="mt-4 text-xl">
            We suggest using the <b>email address that you use at work.</b>
          </p>
        </div>
        <div className="mt-20 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={csrfToken}
              {...register("csrfToken", { required: true })}
            />
            <label className="block text-left text-sm font-semibold text-gray-900">
              Email address
              <input
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                type="text"
                id="email"
                placeholder="you@company.com"
                {...register("email", { required: true })}
              />
              <div className="absolute">
                {errors.email && (
                  <p className="mt-2 text-sm font-bold text-red-500">
                    {" "}
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </label>
            <button
              disabled={isSubmitting}
              className={classNames(
                "mt-20 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
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
