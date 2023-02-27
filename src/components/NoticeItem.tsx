import type { FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";
import PdfViewer from "./PdfViewer";
import DropdownMenu from "./DropdownMenu";
import Badge from "./Badge";

type NoticeItem = {
  notice: RouterOutputs["notice"]["infiniteList"]["notices"][number];
  toggle: () => void;
};

const NoticeItem: FC<NoticeItem> = ({ notice, toggle }) => {
  const { id, title, startDate, endDate, status, uploadUrl, author } = notice;

  const queryClient = useQueryClient();

  // console.log("uploadUrl: ", uploadUrl);

  const deleteMutation = trpc.notice.delete.useMutation({
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
  });

  const deleteMutationLoadingState = deleteMutation.isLoading;

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const updateMutation = trpc.notice.updateStatus.useMutation({
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
      toggle();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePublishChange = () => {
    const status = "published";
    updateMutation.mutate({ data: { status: status }, id: id });
  };

  const handleDraftChange = () => {
    const status = "draft";
    updateMutation.mutate({ data: { status: status }, id: id });
  };

  return (
    <>
      <div
        key={id}
        className="col-span-1 flex flex-col rounded border bg-white shadow"
      >
        <div className="-mt-px flex divide-x divide-gray-200 border-b text-center">
          <div className="my-2 flex w-full flex-col justify-center">
            <p className="text-sm font-semibold uppercase">notice period</p>
            <p className="text-sm text-gray-500">
              {`${dayjs(startDate).format("D MMM YYYY")} -
                  ${dayjs(endDate).format("D MMM YYYY")}`}
            </p>
          </div>
        </div>
        <div className="relative flex flex-1 flex-col">
          <div className="aspect-[1/1.414] flex-shrink-0">
            <PdfViewer uploadUrl={uploadUrl} />
          </div>
          <div className="mt-4 border-t px-4 pb-4">
            <div className="align mt-1 w-full text-center">
              <Badge status={status}>{status}</Badge>
            </div>

            <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
            <div className="flex place-content-between items-center">
              <div className="flex flex-col sm:w-40">
                <span className="text-sm text-gray-900">Uploaded by</span>
                <span className=" truncate text-sm text-gray-500">
                  {author?.name}
                </span>
              </div>
              <DropdownMenu
                handleDelete={handleDelete}
                handlePublishChange={handlePublishChange}
                handleDraftChange={handleDraftChange}
                uploadUrl={uploadUrl}
                deleteMutationLoadingState={deleteMutationLoadingState}
                status={status}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeItem;
