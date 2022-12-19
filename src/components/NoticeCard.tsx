import Heading from "./Heading";

type noticeProps = {
  id: number;
  noticeTitle: string;
  uploadDate: string;
  strataName: string;
};

type noticesProps = {
  strataNotices: noticeProps[];
};

const NoticeCard = (props: noticesProps) => {
  const { strataNotices } = props;
  return (
    <div className="notice-card">
      <section>
        <Heading headingSize="h3">Strata notices</Heading>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {strataNotices.map((notice, index) => (
            <li key={index} className="col-span-1 flex rounded-md shadow-sm">
              <div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  {notice.noticeTitle}
                  <p className="text-gray-500">{notice.uploadDate}</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default NoticeCard;
