import ToolBar from "./ToolBar";
import PdfViewer from "./PdfViewer";
import Tag from "./Tag";

const notices = [
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available available available available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "2",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "3",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "4",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "5",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
];

const GridLayout = () => {
  return (
    <>
      <ul
        role="list"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 pt-6 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="col-span-1 flex flex-col rounded border bg-white shadow"
          >
            <div className="-mt-px flex divide-x divide-gray-200 border-b text-center">
              <div className="flex w-0 flex-1">
                <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Start date</span>
                    <span className="text-xs text-gray-400">
                      {notice.startDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">End date</span>
                    <span className="text-xs text-gray-400">
                      {notice.endDate}
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
                <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-2">
                  {notice.title}
                </h3>
                <div className="mt-1 flex flex-grow flex-col justify-between">
                  <h3 className="sr-only">Title</h3>
                  <span className="sr-only">Uploaded by</span>
                  <div className="mt-4 flex flex-col text-xs">
                    <span className=" font-bold text-gray-900">
                      Uploaded by
                    </span>
                    <span className="text-gray-500">{notice.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-4 w-full">
        <ToolBar />
      </div>
    </>
  );
};

export default GridLayout;
