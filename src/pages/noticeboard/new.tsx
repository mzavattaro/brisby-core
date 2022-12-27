import { type NextPage } from "next";
import type { ChangeEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  documentUrl: z.string(),
});

type NoticeSchema = z.infer<typeof noticeSchema>;
const { mutateAsync } = trpc.notice.create.useMutation();

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);
  const file = formData.get("file");

  console.log("file", file);

  if (!file) {
    return null;
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type);
  console.log("fileType", fileType);
  const { data } = await axios.get(`/api/document?fileType=${fileType}`);
  console.log("data", data);
  const { uploadUrl, key } = data;
  await axios.put(uploadUrl, file);
  console.log("uploadUrl", uploadUrl);
  console.log("key", key);
  return key;
}

const New: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeSchema>({
    resolver: zodResolver(noticeSchema),
  });

  const onSubmit: SubmitHandler<NoticeSchema> = async (data, e) => {
    try {
      await noticeSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }
    await uploadToS3(e);
    mutateAsync(data);
    console.log(data);
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
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
