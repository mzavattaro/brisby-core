import { RouterOutputs } from "../utils/trpc";
import dayjs from "dayjs";
import PdfViewer from "./PdfViewer";
import Tag from "./Tag";

const NoticeItem = ({
  notice,
}: {
  notice: RouterOutputs["notice"]["list"]["notices"][number];
}) => {
  console.log(typeof notice);
  return (
    <>
      <div
        key={notice.id}
        className="col-span-1 flex flex-col rounded border bg-white shadow"
      >
        <div className="-mt-px flex divide-x divide-gray-200 border-b text-center">
          <div className="flex w-0 flex-1">
            <div className="indivne-flex relative -mr-px w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
              <div className="flex flex-col">
                <span className="text-xs font-bold">Start date</span>
                <span className="text-xs text-gray-400">
                  {dayjs(notice.startDate).format("D MMMM YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="indivne-flex relative w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
              <div className="flex flex-col">
                <span className="text-xs font-bold">End date</span>
                <span className="text-xs text-gray-400">
                  {dayjs(notice.endDate).format("D MMMM YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto">
          <Tag type="published">Published</Tag>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex-shrink-0">
            <PdfViewer />
          </div>
          <div className="mt-4 border-t px-4 pb-4">
            <h3 className="divne-clamp-2 mt-3 text-sm font-medium text-gray-900">
              {notice.title}
            </h3>
            <div className="mt-1 flex flex-grow flex-col justify-between">
              <h3 className="sr-only">Title</h3>
              <span className="sr-only">Uploaded by</span>
              <div className="mt-4 flex flex-col text-xs">
                <span className=" font-bold text-gray-900">Uploaded by</span>
                <span className="text-gray-500">{notice.author.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeItem;
