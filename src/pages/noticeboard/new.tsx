import { Fragment, useState } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import axios from "axios";
import { trpc } from "../../utils/trpc";
import { classNames } from "../../utils/classNames";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import Close from "../../../public/Close";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Button from "../../components/Button";
import StyledLink from "../../components/StyledLink";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const publishingOptions = [
  {
    state: "Draft",
    description: "This notice will no longer be publicly accessible.",
  },
  {
    state: "Publish",
    description: "This notice can be viewed by anyone who has the link.",
  },
];

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fileList: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
  uploadUrl: z.string().optional(),
  name: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
  key: z.string().optional(),
  state: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type NoticeSchema = z.infer<typeof noticeSchema>;

async function uploadToS3(data: FileList) {
  const file = data[0];
  if (!file) {
    return null;
  }

  const fileType = encodeURIComponent(file.type);
  const fileData = await axios.get(
    `/api/generateUploadUrl?fileType=${fileType}`
  );
  const { uploadUrl } = fileData.data;
  await axios.put(uploadUrl, file);

  const transformedData = {
    ...fileData.data,
    name: file.name,
    size: file.size,
    type: file.type,
  };

  return transformedData;
}

const New: NextPage = () => {
  const [selected, setSelected] = useState(publishingOptions[0]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeSchema>({
    resolver: zodResolver(noticeSchema),
  });

  const { mutateAsync } = trpc.notice.create.useMutation();

  const onSubmit: SubmitHandler<NoticeSchema> = async (data) => {
    try {
      await noticeSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }

    const transformedData = await uploadToS3(data.fileList);
    const payload = {
      title: data.title,
      state: selected?.state.toLowerCase(),
      startDate: startDate,
      endDate: endDate,
      ...transformedData,
    };
    mutateAsync(payload);
  };

  const getFileParameters = (event: any) => {
    setFileName(event?.target.files[0]?.name);
    setFileSize(event?.target.files[0]?.size / 1000000);
  };

  return (
    <div className="mx-auto max-w-screen-2xl text-gray-900">
      <div className="mx-auto max-w-screen-md px-6">
        <div className="my-6 flex flex-col">
          <div className="content-ceter flex place-content-between">
            <h3 className=" text-xl font-semibold">Upload new strata notice</h3>
            <Link href={"/noticeboard"}>
              <Close />
            </Link>
          </div>
          <p className="mt-2 text-base text-gray-500">
            Upload your organisation’s strata notices and control when your
            building community can view them.
          </p>
        </div>
        {/* Title */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-base font-bold" htmlFor="title">
            Notice title
          </label>
          <input
            className={classNames(
              "mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-4 focus:ring-1",
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
              <p className="mt-2 text-sm font-bold text-red-500">
                {" "}
                {errors.title?.message}
              </p>
            )}
          </div>

          {/* File upload */}
          <div className="mt-10 border-b-2 border-slate-200 pb-10 sm:col-span-6">
            <label className="text-base font-bold" htmlFor="fileList">
              File upload
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
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
              <div className="absolute text-gray-500" id="file-upload-filename">
                File: {fileName}
              </div>
            )}
            {fileSize > 1 && (
              <span
                className="absolute text-sm font-bold text-red-500"
                id="file-upload-filename"
              >
                File size exceeds 1MB limit ({fileSize.toPrecision(3)} MB)
              </span>
            )}
          </div>

          {/* Publish */}
          <div className="mt-10 mb-6">
            <h3 className=" text-xl font-semibold">Publish</h3>
            <p className="mt-2 text-gray-500">
              Select the date range for the notice to be published and visible
              to your building community. If you don’t select an start or end
              date, the notice will be unpublished as a draft.
            </p>
          </div>
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only">
                  Change published status{" "}
                </Listbox.Label>
                <div className="relative">
                  <div
                    className={classNames(
                      "inline-flex divide-x rounded-md shadow-sm",
                      selected?.state === "Draft"
                        ? "divide-slate-400"
                        : "bg-indigo-600"
                    )}
                  >
                    <div
                      className={classNames(
                        "inline-flex divide-x rounded-md shadow-sm",
                        selected?.state === "Draft"
                          ? "divide-slate-400"
                          : "bg-indigo-600"
                      )}
                    >
                      <div
                        className={classNames(
                          "inline-flex items-center rounded-l-md border border-transparent py-2 pl-3 pr-4 shadow-sm",
                          selected?.state === "Draft"
                            ? "bg-slate-200"
                            : "bg-indigo-500 text-white"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        <p className="ml-2.5 text-sm font-medium">
                          {selected?.state}
                        </p>
                      </div>
                      <Listbox.Button
                        className={classNames(
                          "inline-flex items-center rounded-l-none rounded-r-md p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50",
                          selected?.state === "Draft"
                            ? "bg-slate-200 hover:bg-slate-300 focus:ring-slate-200"
                            : "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500"
                        )}
                      >
                        <span className="sr-only">Change published status</span>
                        <ChevronDownIcon
                          className={classNames(
                            "h-5 w-5",
                            selected?.state === "Draft"
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
                          key={option.state}
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
                                  className={
                                    selected ? "font-semibold" : "font-normal"
                                  }
                                >
                                  {option.state}
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
          </Listbox>

          {/* Datepicker */}
          <div className="mt-6 flex flex-col sm:flex-row">
            <div className="sm:mr-9">
              <h3
                className={classNames(
                  "mb-2 text-base font-bold",
                  selected?.state === "Draft"
                    ? "text-gray-400"
                    : "text-gray-900"
                )}
              >
                Start date
              </h3>
              <DatePicker
                showPopperArrow={false}
                selected={selected?.state === "Publish" ? startDate : null}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd MMMM yyyy"
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                disabled={selected?.state === "Draft" ? true : false}
                placeholderText="Unavailable for drafts"
              />
            </div>
            <div className="mt-6 sm:mt-0">
              <h3
                className={classNames(
                  "mb-2 text-base font-bold",
                  selected?.state === "Draft"
                    ? "text-gray-400"
                    : "text-gray-900"
                )}
              >
                End date
              </h3>
              <DatePicker
                showPopperArrow={false}
                selected={selected?.state === "Publish" ? endDate : null}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd MMMM yyyy"
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                disabled={selected?.state === "Draft" ? true : false}
                placeholderText="Unavailable for drafts"
              />
            </div>
          </div>

          {/* Submit form */}
          <div className="flex items-center justify-end">
            <StyledLink className="mr-6" href={"/noticeboard"} styleType="link">
              Cancel
            </StyledLink>
            <Button
              disabled={fileSize > 1 ? true : false}
              type="submit"
              buttonSize="md"
              buttonType="primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default New;
