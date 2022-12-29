import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import Close from "../../../public/Close";
import Link from "next/link";

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fileList: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
  uploadUrl: z.string().optional(),
  name: z.string().optional(),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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
    const fileName = infoArea
      ? (infoArea.textContent = event.target.files[0].name)
      : "";
    return fileName;
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-base font-bold" htmlFor="title">
            Notice title
          </label>
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-4"
            id="title"
            type="text"
            {...register("title", { required: true })}
            placeholder="Title..."
          />
          {errors.title && (
            <p className="mt-2 text-xs italic text-red-500">
              {" "}
              {errors.title?.message}
            </p>
          )}

          <p>Please select file to upload</p>
          <div className="sm:col-span-6">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium text-gray-700"
            >
              Cover photo
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
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">.pdf files up to 2MB</p>
              </div>
            </div>
          </div>
          <div id="file-upload-filename"></div>
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
