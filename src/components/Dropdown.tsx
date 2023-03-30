import type { FC } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../utils/classNames';

type Notice = {
  status: string | null;
};

type Modals = {
  togglePublishModal: () => void;
  toggleDraftModal: () => void;
  toggleArchiveModal: () => void;
};

const DropDown: FC<Modals & Notice> = ({
  status,
  togglePublishModal,
  toggleDraftModal,
  toggleArchiveModal,
}) => (
  <Menu as="div" className="relative inline-block text-left">
    <div>
      <Menu.Button
        className={classNames(
          'inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold capitalize shadow-sm ring-1 ring-inset ring-gray-300 ',
          status === 'published'
            ? 'bg-indigo-700 text-white hover:bg-indigo-800'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        )}
      >
        {status}
        <ChevronDownIcon
          className={classNames(
            '-mr-1 h-5 w-5',
            status === 'published' ? 'text-white' : 'text-gray-600'
          )}
          aria-hidden="true"
        />
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
      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                disabled={status === 'published'}
                onClick={() => togglePublishModal()}
                type="button"
                className={classNames(
                  'block w-full px-4 py-2 text-left text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  status === 'published' && 'cursor-not-allowed text-gray-300'
                )}
              >
                Publish
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                disabled={status === 'draft'}
                onClick={() => toggleDraftModal()}
                type="button"
                className={classNames(
                  'block w-full px-4 py-2 text-left text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  status === 'draft' && 'cursor-not-allowed text-gray-300'
                )}
              >
                Draft
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                disabled={status === 'archived'}
                onClick={() => toggleArchiveModal()}
                type="button"
                className={classNames(
                  'block w-full px-4 py-2 text-left text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  status === 'archived' && 'cursor-not-allowed text-gray-300'
                )}
              >
                Archive
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default DropDown;
