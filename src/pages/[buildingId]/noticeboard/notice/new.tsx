import type { ChangeEventHandler } from "react";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { type NextPage } from "next";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { trpc } from "../../../../utils/trpc";
import { classNames } from "../../../../utils/classNames";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../../../../components/Button";
import StyledLink from "../../../../components/StyledLink";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const publishingOptions = [
  {
    status: "draft",
    description: "This notice will no longer be publicly accessible.",
  },
  {
    status: "published",
    description: "This notice can be viewed by anyone who has the link.",
  },
];

const noticeSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    fileList:
      typeof window === "undefined" ? z.never() : z.instanceof(FileList),
    fileName: z.string().optional(),
    status: z.string().optional(),
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
  })
  .refine((data) => data?.fileList[0], {
    message: "File is required",
    path: ["fileList"],
  });

type NoticeSchema = z.infer<typeof noticeSchema>;

async function uploadToS3(data: FileList) {
  const file = data[0];
  if (!file) {
    return null;
  }

  const fileType = encodeURIComponent(file.type);
  const fileData = await axios.get<{
    uploadUrl: string;
    key: string;
  }>(`/api/generateUploadUrl?fileType=${fileType}`);
  const { uploadUrl } = fileData.data;
  await axios.put(uploadUrl, file);

  const transformedData = {
    ...fileData.data,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };

  return transformedData;
}

const New: NextPage = () => {
  const [selected, setSelected] = useState(publishingOptions[0]);
  const [startDate, setStartDate] = useState<Date | null | undefined>(
    new Date()
  );
  const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);

  const router = useRouter();
  const id = router.query.buildingId as string;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoticeSchema>({
    resolver: zodResolver(noticeSchema),
  });

  const { mutateAsync } = trpc.notice.create.useMutation({
    onSuccess: async (data) => {
      queryClient.setQueryData([["notice"], data.id], data);

      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        return;
      }
    },
  });

  const onSubmit: SubmitHandler<NoticeSchema> = async (data) => {
    try {
      noticeSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }

    const transformedData = await uploadToS3(data.fileList);

    if (!transformedData?.uploadUrl) {
      // massive issue can occur here
      console.log("An error has occured, please try again later.");
      return;
    }

    const payload = {
      id: id,
      title: data.title,
      status: "draft", // selected?.status
      startDate: startDate,
      endDate: endDate,
      uploadUrl: transformedData.uploadUrl,
      key: transformedData?.key,
      fileName: transformedData?.fileName,
      fileSize: transformedData?.fileSize,
      fileType: transformedData?.fileType,
    };

    try {
      await mutateAsync(payload);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }
  };

  const getFileParameters: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event?.target.files?.length) {
      return;
    }

    const file = event?.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setFileSize(file.size / 1000000);
  };

  return (
    <div className="mx-auto max-w-screen-md text-gray-900">
      <div className="mx-6">
        <div className="my-6 flex flex-col">
          <div className="flex place-content-between items-center">
            <h3 className=" text-xl font-semibold">Upload new strata notice</h3>
            <Link
              href={{
                pathname: "/[buildingId]/noticeboard",
                query: { buildingId: id },
              }}
            >
              <XMarkIcon className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-2 text-base text-gray-500">
            Upload your organisation&apos;s strata notices and control when your
            building community can view them.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <label className="text-sm font-semibold" htmlFor="title">
            Notice title
          </label>
          <input
            className={classNames(
              "h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-4 focus:ring-1",
              errors.title
                ? "focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            id="title"
            type="text"
            {...register("title", { required: true })}
            placeholder="Title..."
          />
          <div className="absolute">
            {errors.title && (
              <p className="mt-2 text-sm font-bold text-rose-500">
                {" "}
                {errors.title?.message}
              </p>
            )}
          </div>

          {/* File upload */}
          <div className="mt-10 w-full border-b-2 border-slate-200 pb-10 sm:col-span-6">
            <label className="text-sm font-semibold" htmlFor="fileList">
              File upload
            </label>
            <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="fileList"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="fileList"
                      {...register("fileList")}
                      accept="application/pdf"
                      type="file"
                      className="sr-only"
                      onChange={getFileParameters}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">.pdf files up to 1MB</p>
              </div>
            </div>
            {fileName && fileSize < 1 && (
              <div className="absolute mr-6 text-xs text-gray-500 sm:text-base">
                File: {fileName}
              </div>
            )}
            {fileSize > 1 && (
              <span className="absolute text-sm font-bold text-red-500">
                File size exceeds 1MB limit ({fileSize.toPrecision(3)} MB)
              </span>
            )}
            {errors.fileList && !fileName && (
              <span className="absolute text-sm font-bold text-red-500">
                {errors.fileList?.message?.toString()}
              </span>
            )}
          </div>

          {/* Publish */}
          <div className="mt-10 mb-6">
            <h3 className=" text-xl font-semibold">Publish</h3>
            <p className="mt-2 text-gray-500">
              Select the date range for the notice to be published and visible
              to your building community. If you don&apos;t select an start or
              end date, the notice will be unpublished as a draft.
            </p>
          </div>

          {/* <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only">
                  Change published status{" "}
                </Listbox.Label>
                <div className="relative">
                  <div
                    className={classNames(
                      "inline-flex divide-x rounded-md capitalize shadow-sm",
                      selected?.status === "draft"
                        ? "divide-slate-400"
                        : "bg-indigo-600"
                    )}
                  >
                    <div
                      className={classNames(
                        "inline-flex divide-x rounded-md shadow-sm",
                        selected?.status === "draft"
                          ? "divide-slate-400"
                          : "bg-indigo-600"
                      )}
                    >
                      <div
                        className={classNames(
                          "inline-flex items-center rounded-l-md border border-transparent py-2 pl-3 pr-4 shadow-sm",
                          selected?.status === "draft"
                            ? "bg-slate-200"
                            : "bg-indigo-500 text-white"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        <p className="ml-2.5 text-sm font-medium">
                          {selected?.status}
                        </p>
                      </div>
                      <Listbox.Button
                        className={classNames(
                          "inline-flex items-center rounded-l-none rounded-r-md p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50",
                          selected?.status === "draft"
                            ? "bg-slate-200 hover:bg-slate-300 focus:ring-slate-200"
                            : "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500"
                        )}
                      >
                        <span className="sr-only">Change published status</span>
                        <ChevronDownIcon
                          className={classNames(
                            "h-5 w-5",
                            selected?.status === "draft"
                              ? "text-gray-900"
                              : "text-white"
                          )}
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                    </div>
                  </div>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {publishingOptions.map((option) => (
                        <Listbox.Option
                          key={option.status}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-indigo-500 text-white"
                                : "text-gray-900",
                              "cursor-default select-none p-4 text-sm"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <div className="flex flex-col">
                              <div className="flex justify-between">
                                <p
                                  className={classNames(
                                    "capitalize",
                                    selected ? "font-semibold" : "font-normal"
                                  )}
                                >
                                  {option.status}
                                </p>
                                {selected ? (
                                  <span
                                    className={
                                      active ? "text-white" : "text-indigo-500"
                                    }
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </div>
                              <p
                                className={classNames(
                                  active ? "text-indigo-200" : "text-gray-500",
                                  "mt-2"
                                )}
                              >
                                {option.description}
                              </p>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox> */}

          {/* Datepicker */}
          <div className="mt-6 flex flex-col sm:flex-row">
            <div className="sm:mr-9">
              <h3
                className={classNames(
                  "text-sm font-semibold",
                  selected?.status === "draft"
                    ? "text-gray-400"
                    : "text-gray-900"
                )}
              >
                Start date
              </h3>
              <DatePicker
                showPopperArrow={false}
                selected={selected?.status === "published" ? startDate : null}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd MMMM yyyy"
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                disabled={selected?.status === "draft" ? true : false}
                placeholderText="Unavailable for drafts"
              />
            </div>
            <div className="mt-6 sm:mt-0">
              <h3
                className={classNames(
                  "text-sm font-semibold",
                  selected?.status === "draft"
                    ? "text-gray-400"
                    : "text-gray-900"
                )}
              >
                End date
              </h3>
              <DatePicker
                showPopperArrow={false}
                selected={selected?.status === "published" ? endDate : null}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd MMMM yyyy"
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                disabled={selected?.status === "draft" ? true : false}
                placeholderText="Unavailable for drafts"
              />
            </div>
          </div>

          {/* Submit form */}
          <div className="mt-6 flex items-center justify-end">
            <StyledLink
              className="mr-6"
              href={{
                pathname: "/[buildingId]/noticeboard",
                query: { buildingId: id },
              }}
              onClick={() => router.back()}
              type="link"
            >
              Cancel
            </StyledLink>
            <Button
              disabled={isSubmitting ? true : false}
              type="submit"
              size="md"
              style="primary"
            >
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default New;
