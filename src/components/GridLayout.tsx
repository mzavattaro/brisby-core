const notices = [
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Published",
    author: "John Doe",
  },
];

export default function GridLayout() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 px-8 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {notices.map((notice) => (
        <li
          key={notice.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg border bg-white"
        >
          <div className="-mt-px flex divide-x divide-gray-200 text-center">
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
          <div className="flex flex-1 flex-col p-4">
            <span className="mx-auto h-32 w-32 flex-shrink-0 rounded-full">
              {" "}
              PDF PREVIEW
            </span>
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {notice.title}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="">
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {notice.noticeStatus}
                </span>
              </dd>
              <dt className="sr-only">Uploaded by</dt>
              <dd className="mt-4 flex flex-col text-xs">
                <span className=" font-bold text-gray-900">Uploaded by</span>
                <span className="text-gray-500">{notice.author}</span>
              </dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
