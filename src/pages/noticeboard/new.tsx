import { type NextPage } from "next";
// import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

export const noticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type NoticeSchema = z.infer<typeof noticeSchema>;

const New: NextPage = () => {
  // const [title, setTitle] = useState<string>("");
  // const [error, setError] = useState<string | null>(null);
  const { mutateAsync } = trpc.notice.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeSchema>({
    resolver: zodResolver(noticeSchema),
  });

  const onSubmit: SubmitHandler<NoticeSchema> = async (data) => {
    try {
      await noticeSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return;
    }
    mutateAsync(data);
    console.log(data);
  };
  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   console.log(title);

  //   try {
  //     await noticeSchema.parse({ title });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     }
  //     return;
  //   }
  //   console.log({ title });
  //   mutateAsync({ title });
  // }

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
        {/* {error && JSON.stringify(error)}
        <form onSubmit={handleSubmit}>
          <input
            className="bg-gray-200"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">submit</button>
        </form> */}
      </div>
    </div>
  );
};

export default New;
