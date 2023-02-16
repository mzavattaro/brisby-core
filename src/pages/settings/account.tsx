import type { ReactElement } from "react";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import SettingsLayout from "../../components/SettingsLayout";
import type { NextPageWithLayout } from "../_app";
import { useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import Modal from "../../components/Modal";

const accountSettingsSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    confirmEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .optional(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });

type UserByIdOutput = RouterOutputs["user"]["byId"];

type AccountSettingsSchema = z.infer<typeof accountSettingsSchema> &
  UserByIdOutput;

const Account: NextPageWithLayout<AccountSettingsSchema> = () => {
  const [isShowingEmailModal, setIsShowingEmailModal] = useState(false);
  const [isShowingNameModal, setIsShowingNameModal] = useState(false);
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const cancelButtonRef = useRef(null);

  const { data: user, isLoading: isFetching } = trpc.user.byId.useQuery({
    id: sessionData?.user?.id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
  });

  const toggleNameModal = () => {
    setIsShowingNameModal(!isShowingNameModal);
  };

  const toggleEmailModal = () => {
    setIsShowingEmailModal(!isShowingEmailModal);
  };

  const { mutateAsync, isLoading } = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([["user"], data.id], data);

      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
  });

  const onSubmitNameChange: SubmitHandler<AccountSettingsSchema> = async (
    data
  ) => {
    const { name } = data;

    try {
      await mutateAsync({
        data: {
          name: name,
        },
      });
      setIsShowingNameModal(!isShowingNameModal);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const onSubmitEmailChange: SubmitHandler<AccountSettingsSchema> = async (
    data
  ) => {
    const { email } = data;

    try {
      await mutateAsync({
        data: {
          email: email,
        },
      });
      setIsShowingEmailModal(!isShowingEmailModal);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      {/* Name change */}
      <Modal
        isShowing={isShowingNameModal}
        hide={toggleNameModal}
        cancelButtonRef={cancelButtonRef}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Change name
        </h3>
        <div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Enter your new name.</p>
            <form onSubmit={handleSubmit(onSubmitNameChange)}>
              <label
                className="mt-4 block text-left text-sm font-semibold text-gray-900"
                htmlFor="Name"
              >
                New name
                <input
                  className="mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm"
                  id="name"
                  type="text"
                  defaultValue={user?.name ?? ""}
                  {...register("name")}
                  autoComplete="name"
                />
              </label>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className={classNames(
                    "inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm",
                    isLoading && "cursor-not-allowed opacity-50"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? <span>Updating...</span> : <span>Update</span>}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={toggleNameModal}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Email change */}
      <Modal
        isShowing={isShowingEmailModal}
        hide={toggleEmailModal}
        cancelButtonRef={cancelButtonRef}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Change email address
        </h3>
        <div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Enter your new email address.
            </p>
            <form onSubmit={handleSubmit(onSubmitEmailChange)}>
              <label
                className="mt-4 block text-left text-sm font-semibold text-gray-900"
                htmlFor="Email"
              >
                New email
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  className={classNames(
                    "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                    errors.email
                      ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                      : "focus:border-blue-600 focus:ring-blue-600"
                  )}
                />
                <div className="absolute max-w-xl">
                  {errors.email && (
                    <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                      {errors.email?.message}
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
                  {...register("confirmEmail")}
                  className={classNames(
                    "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
                    errors.confirmEmail
                      ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                      : "focus:border-blue-600 focus:ring-blue-600"
                  )}
                />
                <div className="absolute max-w-xl">
                  {errors.confirmEmail && (
                    <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                      {errors.confirmEmail?.message}
                    </p>
                  )}
                </div>
              </label>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className={classNames(
                    "inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm",
                    isLoading && "cursor-not-allowed opacity-50"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? <span>Updating...</span> : <span>Update</span>}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={toggleEmailModal}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">
            Account settings
          </h1>
        </div>

        <div className="col-span-1 sm:col-span-12">
          <p className="text-gray-500">
            These settings control your personal account information.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl px-2 sm:px-6 md:px-8">
        <h2 className="text-lg font-semibold">Personal information</h2>
        {isFetching ? (
          <span>Loading..</span>
        ) : (
          <div className="flex flex-col">
            {/* Name */}
            <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
              Name
            </h4>
            <p className="w-fit text-gray-500">{user?.name}</p>
            <button
              id="changeName"
              className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
              type="button"
              onClick={toggleNameModal}
              name="changeName"
            >
              change
            </button>

            {/* Email */}
            <h4 className="mt-6 w-fit text-left text-sm font-semibold text-gray-900">
              Email
            </h4>
            <p className="w-fit text-gray-500">{user?.email}</p>
            <button
              id="changeEmail"
              className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
              type="button"
              onClick={toggleEmailModal}
              name="changeEmail"
            >
              change
            </button>
          </div>
        )}
      </div>
    </>
  );
};

Account.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Account;
