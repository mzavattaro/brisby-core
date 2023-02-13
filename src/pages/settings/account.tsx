import type { ReactElement } from "react";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import SettingsLayout from "../../components/SettingsLayout";
import type { NextPageWithLayout } from "../_app";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import Modal from "../../components/Modal";
import useModal from "../../utils/useModal";

const accountSettingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

const Account: NextPageWithLayout<AccountSettingsSchema> = () => {
  const [modal, setModalData] = useState<ReactElement | null>(null);
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
  });

  const getButtonName = () => {
    //get button element name
    if (typeof window !== "undefined") {
      const buttonName = document
        .getElementById("button")
        ?.getAttribute("name");
      if (buttonName === "changeEmail") {
        return "Email change";
      }

      if (buttonName === "changeName") {
        return "Name change";
      }
    }
    return;
  };

  const { mutateAsync, isLoading } = trpc.user.updateUser.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData([["user"], data.id], data);
      queryClient.invalidateQueries();
    },
  });

  const onSubmit: SubmitHandler<AccountSettingsSchema> = async (data) => {
    console.log(data);
    const { name, email } = data;

    mutateAsync({
      data: {
        name: name,
        email: email,
      },
      id: sessionData?.user?.id,
    });
  };

  const { isShowing, toggle } = useModal();
  const cancelButtonRef = useRef(null);

  return (
    <>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        cancelButtonRef={cancelButtonRef}
      >
        Hello
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
        <div className="flex flex-col">
          {/* Name */}
          <h4 className="w-fit text-left text-sm font-semibold text-gray-900">
            Name
          </h4>
          <p className="w-fit text-gray-500">{sessionData?.user?.name}</p>
          <button
            id="changeEmail"
            className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
            type="button"
            onClick={toggle}
            name="changeName"
            // data-modal="modal-one"
          >
            change
          </button>

          {/* Email */}
          <h4 className="mt-6 w-fit text-left text-sm font-semibold text-gray-900">
            Email
          </h4>
          <p className="w-fit text-gray-500">{sessionData?.user?.email}</p>
          <button
            id="changeEmail"
            className="w-fit text-sm font-semibold text-indigo-600 hover:underline"
            type="button"
            onClick={toggle}
            name="changeEmail"
          >
            change
          </button>
        </div>
        {/* <form
          className="grid max-w-7xl grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12"
          onSubmit={handleSubmit(onSubmit)}
        > */}
        {/* Name
            <label className="w-full text-left text-sm font-semibold text-gray-900 sm:col-span-6">
              Name
              <input
                className={classNames(
                  "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                )}
                type="text"
                id="name"
                defaultValue={sessionData?.user?.name as string}
                {...register("name")}
                autoComplete="name"
              />
            </label> */}

        {/* Email address */}
        {/* <label className="text-left text-sm font-semibold text-gray-900 sm:col-span-12">
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
              defaultValue={sessionData?.user?.email as string}
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
          </label> */}

        {/* Save button */}
        {/* <button
            disabled={isLoading}
            className={classNames(
              "col-span-1 mt-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-span-2 sm:col-end-13",
              isLoading && "cursor-not-allowed opacity-50"
            )}
            type="submit"
          >
            {isLoading ? <span>Saving...</span> : <span>Save</span>}
          </button> */}
        {/* </form> */}
      </div>
    </>
  );
};

Account.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Account;
