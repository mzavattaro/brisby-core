import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";

const accountSettingsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  organisation: z.string().optional(),
  streetAddress: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
});

type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

const Account: NextPageWithLayout<AccountSettingsSchema> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
  });

  const onSubmit: SubmitHandler<AccountSettingsSchema> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">
            Account settings
          </h1>
        </div>

        <div className="col-span-1 sm:col-span-12">
          <p className="text-gray-500">
            These settings control your personal and organisastion’s account
            information.
          </p>
        </div>

        <div className="col-span-1 mt-4 sm:col-span-12">
          <h2 className="col-span-1 text-lg font-semibold sm:col-span-12">
            Personal information
          </h2>
          <form
            className="grid max-w-7xl grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* First name */}
            <label className="block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-6">
              First name
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="firstName"
                placeholder="Joe"
                {...register("firstName")}
                autoComplete="given-name"
              />
            </label>

            {/* Last name */}
            <label className="text-gray-90 block w-full text-left text-sm font-semibold sm:col-span-6">
              Last name
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="lastName"
                placeholder="Bloggs"
                {...register("lastName")}
                autoComplete="family-name"
              />
            </label>

            {/* Email address */}
            <label className="block border-b pb-10 text-left text-sm font-semibold text-gray-900 sm:col-span-12">
              Email address
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                  errors.email
                    ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                    : "focus:border-blue-600 focus:ring-blue-600"
                )}
                type="text"
                id="email"
                placeholder="you@company.com"
                {...register("email", { required: true })}
                autoComplete="email"
              />
              <div className="absolute max-w-xl">
                {errors.email && (
                  <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </label>

            <h2 className="col-span-1 pt-4 text-lg font-semibold sm:col-span-12">
              Organisation information
            </h2>
            {/* Company or organisation */}
            <label className="-mt-6 block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
              Company or organisastion
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="organisation"
                {...register("organisation")}
              />
            </label>

            {/* Street address */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-12">
              Street address
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="streetAddress"
                {...register("streetAddress")}
                autoComplete="street-address"
              />
            </label>

            {/* Suburb */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              Suburb
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="suburb"
                {...register("suburb")}
              />
            </label>

            {/* State */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              State
              <select
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                id="state"
                {...register("state")}
              >
                <option value="australian capital terriorty">ACT</option>
                <option value="new south wales">NSW</option>
                <option value="northern territory">NT</option>
                <option value="queensland">QLD</option>
                <option value="south australia">SA</option>
                <option value="tasmania">TAS</option>
                <option value="victoria">VIC</option>
                <option value="western australia">WA</option>
              </select>
            </label>

            {/* Postcode */}
            <label className="block text-left text-sm font-semibold text-gray-900 sm:col-span-4">
              Postcode
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="postcode"
                {...register("postcode")}
                autoComplete="postal-code"
              />
            </label>

            <button
              disabled={isSubmitting}
              className={classNames(
                "col-span-1 mt-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-span-2 sm:col-end-13",
                isSubmitting && "cursor-not-allowed opacity-50"
              )}
              type="submit"
            >
              {isSubmitting ? <span>Saving...</span> : <span>Save</span>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

Account.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Account;
