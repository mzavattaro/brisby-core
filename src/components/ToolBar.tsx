import type { FC, ChangeEvent } from 'react';
import type { SortOrder } from '../pages/[buildingId]/noticeboard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type ToolBarProps = {
  setSortOrder: (sortOrder: SortOrder) => void;
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const ToolBar: FC<ToolBarProps> = ({ setSortOrder, handleSelectChange }) => (
  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
    <div className="flex flex-row space-x-2">
      <div className="relative">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Search"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
    <div className="flex flex-row space-x-2">
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          id="sort"
          name="sort"
          className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          id="per-page"
          name="per-page"
          className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={handleSelectChange}
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>
    </div>
  </div>
);

export default ToolBar;
