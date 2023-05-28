import type { FC } from 'react';
import { useState, useRef } from 'react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { RouterOutputs } from '../../../../utils/trpc';
import { trpc } from '../../../../utils/trpc';
import dayjs from 'dayjs';
import PdfViewer from '../../../../components/PdfViewer';
import Badge from '../../../../components/Badge';
import BackButton from '../../../../components/BackButton';
import Dropdown from '../../../../components/Dropdown';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import PublishNoticeModal from '../../../../components/modals/PublishNoticeModal';
import DraftNoticeModal from '../../../../components/modals/DraftNoticeModal';
import ArchiveNoticeModal from '../../../../components/modals/ArchiveNoticeModal';

type NoticeByIdOutput = RouterOutputs['notice']['byId'];

const Notice = (props: { notice: NoticeByIdOutput }) => {
  const [isShowingPublishModal, setIsShowingPublishModal] = useState(false);
  const [isShowingDraftModal, setIsShowingDraftModal] = useState(false);
  const [isShowingArchiveModal, setIsShowingArchiveModal] = useState(false);

  const cancelButtonRef = useRef(null);

  const { notice } = props;

  const {
    title,
    buildingComplex,
    status,
    startDate,
    endDate,
    author,
    uploadUrl,
    fileName,
  } = notice;

  const togglePublishModal = () => {
    setIsShowingPublishModal(!isShowingPublishModal);
  };

  const toggleDraftModal = () => {
    setIsShowingDraftModal(!isShowingDraftModal);
  };

  const toggleArchiveModal = () => {
    setIsShowingArchiveModal(!isShowingArchiveModal);
  };

  const noticePeriod = `${dayjs(startDate).format('D MMMM YYYY')} -
  ${dayjs(endDate).format('D MMMM YYYY')}`;

  const statusInfo = [
    {
      heading: 'Published',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">public</span> and viewable
          by anyone. Noticeboard subscribers will be notified by email.
        </p>
      ),
    },
    {
      heading: 'Draft',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">private</span> and only
          viewable by members of your organisation. Noticeboard subscribers will
          not be notified by email.
        </p>
      ),
    },
    {
      heading: 'Archived',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">private</span> and only
          viewable within the archive tab of the noticeboard. Noticeboard
          subscribers will not be notified by email.
        </p>
      ),
    },
  ];

  return (
    <>
      <PublishNoticeModal
        isShowing={isShowingPublishModal}
        hide={togglePublishModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingPublishModal={setIsShowingPublishModal}
        notice={notice}
      />

      <DraftNoticeModal
        isShowing={isShowingDraftModal}
        hide={toggleDraftModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingDraftModal={setIsShowingDraftModal}
        notice={notice}
      />

      <ArchiveNoticeModal
        isShowing={isShowingArchiveModal}
        hide={toggleArchiveModal}
        cancelButtonRef={cancelButtonRef}
        setIsShowingArchiveModal={setIsShowingArchiveModal}
        notice={notice}
      />

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
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="border bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Notice Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Details and information about the notice.
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Noticeboard
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {buildingComplex?.name}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Status
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <Badge status={status}>{status}</Badge>
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Notice Period
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {noticePeriod}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Uploaded By
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {author.name}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          Fugiat ipsum ipsum deserunt culpa aute sint do nostrud
                          anim incididunt cillum culpa consequat.
                        </dd>
                      </div>
                      <div className="sm:col-span-1" />
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Preview
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="border">
                            <PdfViewer uploadUrl={uploadUrl} />
                          </div>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Attachment
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                            <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                              <div className="flex w-0 flex-1 items-center">
                                <PaperClipIcon
                                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-2 w-0 flex-1 truncate">
                                  {fileName}
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a
                                  href={uploadUrl}
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
            </div>

            <section
              aria-labelledby="timeline-title"
              className="lg:col-span-1 lg:col-start-3"
            >
              <div className="border bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                <div className="flex place-content-between">
                  <h2
                    id="timeline-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Notice Status
                  </h2>
                  <Badge status={status}>{status}</Badge>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Change the status of the notice.
                </p>

                <div className="mt-4 flex flex-col justify-stretch">
                  <Dropdown
                    status={status}
                    togglePublishModal={togglePublishModal}
                    toggleDraftModal={toggleDraftModal}
                    toggleArchiveModal={toggleArchiveModal}
                  />
                </div>

                {/* Status */}
                <div className="flow-root">
                  <ul className="">
                    {statusInfo.map((item) => (
                      <li className="my-4" key={item.heading}>
                        <div className="text-sm text-indigo-600">
                          {item.heading}
                        </div>
                        <div className="text-sm">{item.content}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
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
