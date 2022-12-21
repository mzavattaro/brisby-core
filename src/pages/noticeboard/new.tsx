import { type NextPage } from "next";
import { useState } from "react";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

export const noticeSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3),
});

const New: NextPage = () => {
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync } = trpc.notice.create.useMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(title);

    try {
      await noticeSchema.parse({ title });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      return;
    }

    mutateAsync({ title });
  }

  return (
    <div className="mx-auto max-w-screen-2xl text-gray-900">
      <div className="max-w-screen-2xl px-6">
        {error && JSON.stringify(error)}
        <form onSubmit={handleSubmit}>
          <input
            className="bg-gray-200"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
