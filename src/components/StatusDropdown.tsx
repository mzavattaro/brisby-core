import type { FC } from 'react';
import { Fragment, useState } from 'react';
/*
 * import { trpc } from '../utils/trpc';
 * import { useQueryClient } from '@tanstack/react-query';
 */
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../utils/classNames';

const options = [
  {
    status: 'published',
    description: 'Public and viewable by anyone.',
  },
  {
    status: 'draft',
    description: 'Private and only viewable by members of your organisation.',
  },
  {
    status: 'archived',
    description: 'Private and only viewable within the noticeboard archive.',
  },
];

type notice = {
  id: string;
  status: string | null;
};

const StatusDropdown: FC<notice> = ({ id, status }) => {
  const [selected, setSelected] = useState(options[0]);
  // const queryClient = useQueryClient();

  // eslint-disable-next-line no-console
  console.log(status);
  // eslint-disable-next-line no-console
  console.log(id);

  /*
   * const updateMutation = trpc.notice.updateStatus.useMutation({
   *   onSuccess: async () => {
   *     try {
   *       await queryClient.invalidateQueries();
   *     } catch (error) {
   *       if (error instanceof Error) {
   *         // eslint-disable-next-line no-console
   *         console.log(error.message);
   *       }
   *     }
   *   },
   * });
   */

  /*
   * const handlePublishChange = () => {
   *   const newStatus = 'published';
   *   updateMutation.mutate({ data: { status: newStatus }, id });
   * };
   */

  /*
   * const handleDraftChange = () => {
   *   const newStatus = 'draft';
   *   updateMutation.mutate({ data: { status: newStatus }, id });
   * };
   */

  /*
   * const handleArchiveChange = () => {
   *   const newStatus = 'archived';
   *   updateMutation.mutate({ data: { status: newStatus }, id });
   * };
   */

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Change published status{' '}
          </Listbox.Label>
          <div className="relative w-full">
            <div
              className={classNames(
                'inline-flex divide-x rounded-md capitalize shadow-sm',
                selected?.status === 'published'
                  ? 'bg-indigo-600'
                  : 'divide-slate-400'
              )}
            >
              <div
                className={classNames(
                  'inline-flex divide-x rounded-md shadow-sm',
                  selected?.status === 'published'
                    ? 'bg-indigo-600'
                    : 'divide-slate-400'
                )}
              >
                <div
                  className={classNames(
                    'inline-flex items-center rounded-l-md border border-transparent py-2 pl-3 pr-4 shadow-sm',
                    selected?.status === 'published'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-200'
                  )}
                >
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  <p className="ml-2.5 text-sm font-medium">
                    {selected?.status}
                  </p>
                </div>
                <Listbox.Button
                  className={classNames(
                    'inline-flex items-center rounded-l-none rounded-r-md p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50',
                    selected?.status === 'published'
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500'
                      : 'bg-slate-200 hover:bg-slate-300 focus:ring-slate-200'
                  )}
                >
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon
                    className={classNames(
                      'h-5 w-5',
                      selected?.status === 'published'
                        ? 'text-white'
                        : 'text-gray-900'
                    )}
                    aria-hidden="true"
                  />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.status}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900',
                        'cursor-default select-none p-4 text-sm'
                      )
                    }
                    value={option}
                  >
                    {({ selected: selectedItem, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={classNames(
                              'capitalize',
                              selectedItem ? 'font-semibold' : 'font-normal'
                            )}
                          >
                            {option.status}
                          </p>
                          {selectedItem ? (
                            <span
                              className={
                                active ? 'text-white' : 'text-indigo-500'
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={classNames(
                            active ? 'text-indigo-200' : 'text-gray-500',
                            'mt-2'
                          )}
                        >
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
export default StatusDropdown;
