import React from 'react';
import type { FC } from 'react';
import Modal from '../Modal';
import { classNames } from '../../utils/classNames';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '../../utils/trpc';
import { updateSearchObject } from '../../utils/search';

type ArchiveModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  setIsShowingArchiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  notice: {
    id: string;
  };
};

const ArchiveNoticeModal: FC<ArchiveModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
  setIsShowingArchiveModal,
  notice,
}) => {
  const queryClient = useQueryClient();

  const { id } = notice;

  const { mutate, isLoading } = trpc.notice.updateStatus.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const handleArchiveChange = async () => {
    const newStatus = 'archived';
    mutate({ data: { status: newStatus }, id });
    await updateSearchObject([{ objectID: id, status: newStatus }]);
    setIsShowingArchiveModal(!isShowing);
  };

  return (
    <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Archive notice
      </h3>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to archive this notice? The notice will be
            private and only viewable by members of your organisation.
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={classNames(
            'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
            isLoading && 'cursor-not-allowed opacity-50'
          )}
          onClick={handleArchiveChange}
          disabled={isLoading}
        >
          {isLoading ? <span>Archiving...</span> : <span>Archive</span>}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={hide}
          ref={cancelButtonRef}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ArchiveNoticeModal;
