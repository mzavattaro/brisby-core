import type { FC } from 'react';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import Badge from './Badge';
import dayjs from 'dayjs';
import PdfViewer from './PdfViewer';
import type { RouterOutputs } from '../utils/trpc';

type NoticeByIdOutput = RouterOutputs['notice']['byId'];

type NoticeInfoLayoutProps = {
  notice: NoticeByIdOutput;
};

const NoticeInfoLayout: FC<NoticeInfoLayoutProps> = ({ notice }) => {
  const {
    buildingComplex,
    status,
    startDate,
    endDate,
    author,
    uploadUrl,
    fileName,
  } = notice;

  const noticePeriod = `${dayjs(startDate).format('D MMMM YYYY')} -
  ${dayjs(endDate).format('D MMMM YYYY')}`;

  return (
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
              <dt className="text-sm font-medium text-gray-500">Noticeboard</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {buildingComplex?.name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Badge status={status}>{status}</Badge>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Notice Period
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{noticePeriod}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Uploaded By</dt>
              <dd className="mt-1 text-sm text-gray-900">{author.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Preview</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="border">
                  <PdfViewer uploadUrl={uploadUrl} />
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Attachment</dt>
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
  );
};

export default NoticeInfoLayout;
