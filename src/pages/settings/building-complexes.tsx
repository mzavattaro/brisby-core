import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import Link from "next/link";

const BuildingComplexes: NextPageWithLayout = () => {
  const buildings = [
    {
      id: "1",
      name: "Kimberly Court",
      buildingType: "Residential",
      addedBy: "Joe Bloggs",
      totalOccupancies: "32",
      address: "123 Fake Street",
    },
    {
      id: "2",
      name: "54 Dutruc Street",
      buildingType: "Residential",
      addedBy: "Joe Bloggs",
      totalOccupancies: "32",
      address: "123 Fake Street",
    },
    {
      id: "3",
      name: "Fake Complex",
      buildingType: "Residential",
      addedBy: "Joe Bloggs",
      totalOccupancies: "32",
      address: "123 Fake Street",
    },
    {
      id: "4",
      name: "White House",
      buildingType: "Residential",
      addedBy: "Joe Bloggs",
      totalOccupancies: "32",
      address: "123 Fake Street",
    },
  ];

  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-2 sm:grid-cols-12 sm:px-6 md:px-8">
        <div className="col-span-1 sm:col-span-12">
          <h1 className="text-xl font-semibold text-gray-900">
            Building complexes
          </h1>
        </div>
        <div className="col-span-1 -mt-2 sm:col-span-12">
          <p className="text-gray-500">
            List of building complexes managed by you. View and update each
            building complexe you notify.
          </p>
        </div>

        <Link
          className="sm:col-end-13 sm:justify-self-end"
          href={"/building/new"}
        >
          <button className="font-base h-10 w-31 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Add building
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
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Building Type
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Total Occupancies
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Address
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {buildings.map((building) => (
                <tr key={building.id}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {building.name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Building Type</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {building.buildingType}
                      </dd>
                      <dt className="sr-only sm:hidden">Total Occupancies</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden">
                        {building.totalOccupancies}
                      </dd>
                      <dt className="sr-only sm:hidden">Address</dt>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {building.buildingType}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {building.totalOccupancies}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {building.address}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View<span className="sr-only">, {building.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

BuildingComplexes.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default BuildingComplexes;