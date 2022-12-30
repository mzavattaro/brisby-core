import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import Close from "../../../public/Close";
import Link from "next/link";
import UploadFile from "../../../public/UploadFile";
import { classNames } from "../../utils/classNames";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const publishingOptions = [
  {
    state: "Published",
    description: "This job posting can be viewed by anyone who has the link.",
    current: true,
  },
  {
    state: "Draft",
    description: "This job posting will no longer be publicly accessible.",
    current: false,
  },
];

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fileList: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
  uploadUrl: z.string().optional(),
  name: z.string(),
  size: z.number().optional(),
  type: z.string().optional(),
  key: z.string().optional(),
});

type NoticeSchema = z.infer<typeof noticeSchema>;

async function uploadToS3(data: FileList) {
  const file = data[0];
  if (!file) {
    return null;
  }

  const fileType = encodeURIComponent(file.type);
  const fileData = await axios.get(`/api/document?fileType=${fileType}`);
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
      ...transformedData,
    };
    mutateAsync(payload);
  };

  const handleChange = (event: any) => {
    const infoArea = document.getElementById("file-upload-filename");
    infoArea
      ? (infoArea.textContent = "File: " + event.target.files[0].name)
      : "";
  };

  console.log("selected: ", selected);

  return (
    <div className="mx-auto max-w-screen-2xl text-gray-900">
      <div className="mx-auto max-w-screen-md px-6">
        <div className="my-6 flex flex-col">
          <div className="content-ceter flex place-content-between items-center">
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

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="mb-10">
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
              {...register("title")}
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
          </div>
          {/* File upload */}
          <div className="border-b-2 border-slate-200 pb-10 sm:col-span-6">
            <label className="text-base font-bold" htmlFor="fileList">
              File upload
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <UploadFile />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="fileList"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span className="font-bold">Upload a file</span>
                    <input
                      id="fileList"
                      {...register("fileList")}
                      accept="application/pdf"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">.pdf files up to 2MB</p>
              </div>
            </div>
            <div
              className="absolute text-sm text-gray-500"
              id="file-upload-filename"
            ></div>
          </div>
          {/* Publish */}
          <div className="mt-10">
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
                  {" "}
                  Change published status{" "}
                </Listbox.Label>
                <div className="relative">
                  <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                    <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                      <div className="inline-flex items-center rounded-l-md border border-transparent bg-indigo-500 py-2 pl-3 pr-4 text-white shadow-sm">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        <p className="ml-2.5 text-sm font-medium">
                          {selected?.state}
                        </p>
                      </div>
                      <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-500 p-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <span className="sr-only">Change published status</span>
                        <ChevronDownIcon
                          className="h-5 w-5 text-white"
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

          <div className="flex items-center justify-end">
            <ButtonLink className="mr-6" href={"/noticeboard"} fontSize="md">
              Cancel
            </ButtonLink>
            <Button type="submit" buttonSize="md" buttonType="primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default New;
