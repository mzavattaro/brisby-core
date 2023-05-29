import type { FC } from 'react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { RouterOutputs } from '../../../../utils/trpc';
import { trpc } from '../../../../utils/trpc';
import BackButton from '../../../../components/BackButton';
import NoticeInfoLayout from '../../../../components/NoticeInfoLayout';
import StatusController from '../../../../components/StatusController';

type NoticeByIdOutput = RouterOutputs['notice']['byId'];

const Notice = (props: { notice: NoticeByIdOutput }) => {
  const { notice } = props;

  const { title, status, id } = notice;

  return (
    <div className="min-h-full">
      <main className="py-10">
        {/* Page header */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <span
                  className="absolute inset-0 rounded-full shadow-inner"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <BackButton>Back to noticeboard</BackButton>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 line-clamp-2">
                {title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            <NoticeInfoLayout notice={notice} />
          </div>

          <section
            aria-labelledby="timeline-title"
            className="lg:col-span-1 lg:col-start-3"
          >
            {/* Here */}

            <StatusController status={status} id={id} />
          </section>
        </div>
      </main>
    </div>
  );
};

const NoticeViewPage: FC = () => {
  const id = useRouter().query.id as string;
  const noticeQuery = trpc.notice.byId.useQuery({ id });

  if (noticeQuery.error) {
    return (
      <NextError
        title={noticeQuery.error.message}
        statusCode={noticeQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (noticeQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data } = noticeQuery;
  return <Notice notice={data} />;
};

export default NoticeViewPage;
