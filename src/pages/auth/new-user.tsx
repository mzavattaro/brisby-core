import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import { useRouter } from "next/router";

const newUserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  organisation: z
    .string()
    .min(1, { message: "Company or organisation is required" }),
});

type NewUserSchema = z.infer<typeof newUserSchema> & {
  user: RouterOutputs["user"]["updateUser"];
};

const NewUser: React.FC<NewUserSchema> = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: sessionData } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewUserSchema>({
    resolver: zodResolver(newUserSchema),
  });

  const updateMutation = trpc.user.updateUser.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData([["user"], data.id], data);
      queryClient.invalidateQueries();
    },
  });

  const onSubmit: SubmitHandler<NewUserSchema> = async (data) => {
    updateMutation.mutate({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        organisation: data.organisation,
      },
      id: sessionData?.user?.id,
    });

    router.push("/noticeboard");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="mx-4 mt-8 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
          <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            Let's setup your new account
          </h2>
          <p className="mt-6 text-xl text-gray-900">
            You can change these later in your <b>account settings</b>
          </p>
        </div>
        <div className="mt-8 sm:mx-10">
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <button
              disabled={isSubmitting}
              className={classNames(
                "mt-13 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-16",
                isSubmitting && "cursor-not-allowed opacity-50"
              )}
              type="submit"
            >
              {isSubmitting ? <span>Creating...</span> : <span>Continue</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
