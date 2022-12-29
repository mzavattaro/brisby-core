import { type NextPage } from "next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import axios from "axios";

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

  return (
    <div className="mx-auto max-w-screen-2xl text-gray-900">
      <div className="max-w-screen-2xl px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
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
          {errors.title && (
            <p className="mt-2 text-xs italic text-red-500">
              {" "}
              {errors.title?.message}
            </p>
          )}

          <p>Please select file to upload</p>
          <input
            type="file"
            {...register("fileList")}
            accept="application/pdf"
          />
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
