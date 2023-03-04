import { useBuildingComplexIdStore } from "../../store/useBuildingComplexIdStore";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { trpc } from "../../utils/trpc";
import SettingsLayout from "../../components/SettingsLayout";
import Link from "next/link";
import dayjs from "dayjs";

const Notices: NextPageWithLayout = () => {
  const { data: notices, isLoading } = trpc.notice.byOrganisation.useQuery();
  const buildingComplexId = useBuildingComplexIdStore((state) => state.id);

  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">Notices</h1>
        </div>
        <div className="col-span-1 -mt-2 sm:col-span-12">
          <p className="text-gray-500">
            List of notice complexes managed by you. You can view and update
            each notice.
          </p>
        </div>

        <Link
          className="sm:col-end-13 sm:justify-self-end"
          href={{
            pathname: "/[buildingComplexId]/noticeboard/notice/new",
            query: { buildingComplexId: buildingComplexId },
          }}
        >
          <button className="font-base h-10 w-31 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Add notice
          </button>
        </Link>
      </div>
      {/* Table */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  File name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Building Complex
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Notice Period
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {notices?.length === 0 ? (
                <tr className="h-80">
                  <td>
                    <p className="text-center">There are no notices to show.</p>
                  </td>
                </tr>
              ) : (
                <>
                  {notices?.map((notice) => (
                    <>
                      {isLoading ? (
                        <span>Loading...</span>
                      ) : (
                        <tr key={notice.id}>
                          <td className="w-full max-w-0 py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                            {notice.fileName}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">Building Complex</dt>
                              <dd className="mt-1 truncate text-gray-700">
                                {notice.buildingComplex?.name}
                              </dd>
                              <dt className="sr-only sm:hidden">
                                Notice Period
                              </dt>
                              <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                {`${dayjs(notice.startDate).format(
                                  "D MMMM YYYY"
                                )} - ${dayjs(notice.endDate).format(
                                  "D MMMM YYYY"
                                )}`}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-xs text-gray-500 lg:table-cell">
                            {notice.buildingComplex?.name}
                          </td>
                          <td className="hidden px-3 py-4 text-xs text-gray-500 sm:table-cell">
                            {`${dayjs(notice.startDate).format(
                              "D MMMM YYYY"
                            )} - ${dayjs(notice.endDate).format(
                              "D MMMM YYYY"
                            )}`}
                          </td>
                          <td className="px-3 py-4">
                            <div className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              {notice.status}
                            </div>
                          </td>
                          <td className="py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                              <span className="sr-only">{notice.fileName}</span>
                            </a>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

Notices.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Notices;
