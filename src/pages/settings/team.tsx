import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const teamSchema = z.object({
  email: z.string().email(),
});

type TeamSchema = z.infer<typeof teamSchema>;

const Team: NextPageWithLayout<TeamSchema> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamSchema>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit: SubmitHandler<TeamSchema> = (data) => {
    console.log(data);
  };

  const users = [
    {
      name: "Michael Zavattaro",
      email: "mwzavattaro@icloud.com",
      joined: "12 January 2023",
    },
    {
      name: "Tom Cook",
      email: "example1@gmail.com",
      joined: "12 January 2023",
    },
    {
      name: "Joe Bloggs",
      email: "example2@gmail.com",
      joined: "12 January 2023",
    },
    {
      name: "Ameda Smith",
      email: "example3@gmail.com",
      joined: "12 January 2023",
    },
  ];

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
      <div className="col-span-1 sm:col-span-12">
        <h1 className="text-xl font-semibold text-gray-900">Team settings</h1>
      </div>
      <div className="col-span-1 sm:col-span-12">
        <p className="text-gray-500">
          Add or remove team members from your Brisby account.
        </p>
      </div>
      <div className="col-span-1 mt-4 sm:col-span-12">
        <form
          className="grid max-w-7xl grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* New user */}
          <label className="block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-12">
            Add new user email
            <input
              className={classNames(
                "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              )}
              type="text"
              id="email"
              placeholder="example@email.com"
              {...register("email")}
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
          <button
            disabled={isSubmitting}
            className={classNames(
              "col-span-1 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-span-2 sm:col-end-13",
              isSubmitting && "cursor-not-allowed opacity-50"
            )}
            type="submit"
          >
            {isSubmitting ? <span>Sending...</span> : <span>Send</span>}
          </button>
        </form>

        <h2 className="col-span-1 mt-10 -mb-4 text-lg font-semibold text-gray-900 sm:col-span-12">
          Users
        </h2>
        {users.map((user) => (
          <div key={user.email} className="mt-4">
            <div className="flex place-content-between">
              <h3 className="font-bold text-indigo-600">{user.name}</h3>
              <span className="text-sm text-gray-900 sm:text-base">
                Joined on {user.joined}
              </span>
            </div>
            <div className="mt-1 flex place-content-between border-b pb-4">
              <div className="flex content-center">
                <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                <a className="ml-2 text-gray-400" href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              </div>
              <button
                type="submit"
                className="text-gray-500 hover:text-indigo-900 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Team.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Team;
