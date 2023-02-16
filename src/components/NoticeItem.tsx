import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";
import PdfViewer from "./PdfViewer";
import DropdownMenu from "./DropdownMenu";
import Tag from "./Tag";
import { useQueryClient } from "@tanstack/react-query";

type NoticeItem = {
  notice: RouterOutputs["notice"]["list"]["notices"][number];
  toggle: () => void;
};

const NoticeItem: React.FC<NoticeItem> = ({ notice, toggle }) => {
  const { id, title, startDate, endDate, status, uploadUrl, author } = notice;

  const queryClient = useQueryClient();

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
      setTimeout(toggle, 220);
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
          <div className="flex w-0 flex-1">
            <div className="indivne-flex relative -mr-px w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
              <div className="flex flex-col">
                <span className="text-xs font-bold">Start date</span>
                <span className="text-xs text-gray-400">
                  {dayjs(startDate).format("D MMMM YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="indivne-flex relative w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent pt-2 text-sm font-medium text-gray-700 hover:text-gray-500">
              <div className="flex flex-col">
                <span className="text-xs font-bold">End date</span>
                <span className="text-xs text-gray-400">
                  {dayjs(endDate).format("D MMMM YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto">
          <Tag status={status}>{status?.toUpperCase()}</Tag>
        </div>
        <div className="relative flex flex-1 flex-col">
          <div className="flex-shrink-0">
            <PdfViewer uploadUrl={uploadUrl} />
          </div>
          <div className="mt-4 border-t px-4 pb-4">
            <h3 className="mt-3 mb-6 text-sm font-medium text-gray-900 line-clamp-2">
              {title}
            </h3>
            <span className="text-sm font-semibold text-gray-900">
              Uploaded by
            </span>
            <div className="flex place-content-between">
              <span className=" truncate text-sm text-gray-500">
                {author?.name}
              </span>
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
