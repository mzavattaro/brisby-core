import type { FC } from 'react';
import { classNames } from '../utils/classNames';
import { useBuildingComplexIdStore } from '../store/useBuildingComplexIdStore';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

type DropdownMenuProps = {
  uploadUrl: string;
  id: string | null;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ uploadUrl, id }) => {
  const buildingComplexId = useBuildingComplexIdStore((state) => state.id);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-8 right-0 z-10 mt-2 w-28 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-56">
          <div className="divide divide-y">
            <div>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href={uploadUrl}
                    className={classNames(
                      'block px-4 py-2 text-sm',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    Download
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={{
                      pathname: '/[buildingId]/noticeboard/notice/[id]',
                      query: { buildingId: buildingComplexId, id },
                    }}
                    className={classNames(
                      'block px-4 py-2 text-sm',
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    View
                  </Link>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
