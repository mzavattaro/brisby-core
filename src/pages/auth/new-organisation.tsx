import type { NextPage } from "next";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import { useRouter } from "next/router";

const organisationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type OrganisationSchema = z.infer<typeof organisationSchema>;

const Organisation: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganisationSchema>({
    resolver: zodResolver(organisationSchema),
  });

  const { mutateAsync, isLoading } = trpc.organisation.create.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([["organisation"], data.id], data);
      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
    onError: async (error) => {
      if (error instanceof Error) {
        try {
          await router.push("/auth/building-complexes");
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
      }
    },
  });

  const onSubmit: SubmitHandler<OrganisationSchema> = async (data) => {
    const { name } = data;

    try {
      organisationSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }

    try {
      await mutateAsync({ name: name });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }

    try {
      await router.push("/auth/building-complexes");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }
  };

  return (
    <div className="mx-4 mt-6 text-center sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="text-center">
        <h4>Step 2 of 3</h4>
        <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Setup your company or organisation
        </h2>
        <p className="mt-2 text-lg text-gray-900">
          You can change these later in your <b>organisation settings</b>
        </p>
      </div>
      <div className="mt-6 sm:mx-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Organisation */}
          <label className="mt-6 block text-left text-sm font-semibold text-gray-900">
            Company or organisation
            <input
              className={classNames(
                "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                errors.name
                  ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                  : "focus:border-blue-600 focus:ring-blue-600"
              )}
              type="text"
              id="name"
              placeholder="Acme Inc."
              {...register("name", { required: true })}
              autoComplete="organization"
            />
            <div className="absolute max-w-xl">
              {errors.name && (
                <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                  {" "}
                  {errors.name?.message}
                </p>
              )}
            </div>
          </label>

          <button
            disabled={isLoading}
            className={classNames(
              "mt-10 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-10",
              isLoading && "cursor-not-allowed opacity-50"
            )}
            type="submit"
          >
            {isLoading ? <span>Creating...</span> : <span>Submit</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Organisation;
