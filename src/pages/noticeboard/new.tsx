import { type NextPage } from "next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import axios from "axios";

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  document: z.string(),
  uploadUrl: z.string().optional(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  key: z.string(),
});

type NoticeSchema = z.infer<typeof noticeSchema>;

// async function uploadToS3(data: any) {
//   const file = data.file[0];

//   if (!file) {
//     return null;
//   }

//   const fileType = encodeURIComponent(file.type);
//   const fileData = await axios.get(`/api/document?fileType=${fileType}`);
//   const { uploadUrl, key } = fileData.data;
//   await axios.put(uploadUrl, file);
//   return key;
// }

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
    console.log("data FN", data.firstName);
    mutateAsync(data);
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

          <input
            id="title"
            type="text"
            {...register("firstName", { required: true })}
            placeholder="Firstname..."
          />
          {errors.title && (
            <p className="mt-2 text-xs italic text-red-500">
              {" "}
              {errors.title?.message}
            </p>
          )}

          <p>Please select file to upload</p>
          {/* <input
            type="file"
            {...register("uploadUrl")}
            accept="application/pdf"
          /> */}
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
