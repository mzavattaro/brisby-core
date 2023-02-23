import type { FC } from "react";
import { classNames } from "../utils/classNames";
import { Fragment, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import useModal from "../utils/useModal";
import Modal from "./Modal";

type DropdownMenuProps = {
  handleDelete: () => void;
  handlePublishChange: () => void;
  handleDraftChange: () => void;
  uploadUrl: string;
  deleteMutationLoadingState: boolean;
  status: string | null;
};

const DropdownMenu: FC<DropdownMenuProps> = ({
  uploadUrl,
  handleDelete,
  handlePublishChange,
  handleDraftChange,
  deleteMutationLoadingState,
  status,
}) => {
  const { isShowing, toggle } = useModal();
  const cancelButtonRef = useRef(null);

  console.log(uploadUrl);

  return (
    <>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        cancelButtonRef={cancelButtonRef}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Delete notice
        </h3>
        <div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this notice? It will be
              permanently removed from the noticeboard.{" "}
              <span className="font-bold">This action cannot be undone.</span>
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={classNames(
              "inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm",
              deleteMutationLoadingState && "cursor-not-allowed opacity-50"
            )}
            onClick={handleDelete}
            disabled={deleteMutationLoadingState}
          >
            {deleteMutationLoadingState ? (
              <span>Deleting...</span>
            ) : (
              <span>Delete</span>
            )}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={toggle}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
        </div>
      </Modal>
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
          <Menu.Items className="absolute bottom-8 right-0 z-10 mt-2 w-56 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="divide divide-y">
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={uploadUrl}
                      className={classNames(
                        "block px-4 py-2 text-sm",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      )}
                    >
                      Download
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      disabled={status === "published"}
                      onClick={handlePublishChange}
                      className={classNames(
                        "block w-full px-4 py-2 text-left text-sm",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        status === "published" &&
                          "cursor-not-allowed opacity-50"
                      )}
                    >
                      Publish
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      disabled={status === "draft"}
                      onClick={handleDraftChange}
                      className={classNames(
                        "block w-full px-4 py-2 text-left text-sm",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        status === "draft" && "cursor-not-allowed opacity-50"
                      )}
                    >
                      Draft
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        "block px-4 py-2 text-sm",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      )}
                    >
                      Archive
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="w-56">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={toggle}
                      className={classNames(
                        "block w-full px-4 py-2 text-left text-sm",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default DropdownMenu;
