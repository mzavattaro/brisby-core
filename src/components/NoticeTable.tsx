import dayjs from 'dayjs';
import Link from 'next/link';
import type { FC, RefObject } from 'react';
import type { NoticeProps } from '../pages/[buildingId]/noticeboard';
import { classNames } from '../utils/classNames';
import Badge from './Badge';

type NoticeTableProps = {
  notices: NoticeProps;
  queryBuildingId: string;
  selectedDocument: NoticeProps;
  setSelectedDocument: (selectedDocument: NoticeProps) => void;
  handleBulkArchive: () => void;
  checkbox: RefObject<HTMLInputElement>;
  checked: boolean;
  toggleAll: () => void;
};

const NoticeTable: FC<NoticeTableProps> = ({
  notices,
  queryBuildingId,
  selectedDocument,
  setSelectedDocument,
  handleBulkArchive,
  checkbox,
  checked,
  toggleAll,
}) => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle">
          <div className="relative">
            {selectedDocument && selectedDocument.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  onClick={handleBulkArchive}
                >
                  Archive
                </button>
              </div>
            )}
            <table className="min-w-full table-fixed divide-y divide-gray-300 ">
              <thead>
                <tr className="bg-slate-50">
                  <th
                    scope="col"
                    className="relative rounded-tl-md px-7 sm:w-12 sm:px-6"
                  >
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      ref={checkbox}
                      checked={checked}
                      onChange={toggleAll}
                    />
                  </th>
                  <th
                    scope="col"
                    className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    File name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Start period
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    End period
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="relative rounded-tr-md py-3.5 pl-3 pr-4 sm:pr-3"
                  >
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {notices?.map((notice) => (
                  <tr
                    key={notice.id}
                    className={
                      selectedDocument?.includes(notice)
                        ? 'bg-gray-50'
                        : undefined
                    }
                  >
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      {selectedDocument?.includes(notice) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                      )}
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        value={notice.id}
                        checked={selectedDocument?.includes(notice)}
                        onChange={(event) =>
                          setSelectedDocument(
                            event.target.checked
                              ? [...(selectedDocument ?? []), notice]
                              : selectedDocument?.filter(
                                  (document) => document !== notice
                                )
                          )
                        }
                      />
                    </td>
                    <td
                      className={classNames(
                        'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                        selectedDocument?.includes(notice)
                          ? 'text-indigo-600'
                          : 'text-gray-900'
                      )}
                    >
                      {notice.fileName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {notice.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dayjs(notice.startDate).format('D MMMM YYYY')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dayjs(notice.endDate).format('D MMMM YYYY')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {notice.author.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Badge status={notice.status}>{notice.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <Link
                        href={{
                          pathname: '/[buildingId]/noticeboard/notice/[id]',
                          query: {
                            buildingId: queryBuildingId,
                            id: notice.id,
                          },
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View<span className="sr-only">, {notice.id}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NoticeTable;
