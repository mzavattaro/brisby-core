import type { FC } from 'react';
import Badge from './Badge';
import Dropdown from './Dropdown';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { updateSearchObject } from '../utils/search';

type StatusControllerProps = {
  status: string | null;
  id: string;
};

const StatusController: FC<StatusControllerProps> = ({ status, id }) => {
  const queryClient = useQueryClient();

  const { mutate } = trpc.notice.updateStatus.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const handleArchiveChange = async () => {
    const newStatus = 'archived';
    mutate({ data: { status: newStatus }, id });
    await updateSearchObject([{ objectID: id, status: newStatus }]);
  };

  const handlePublishChange = async () => {
    const newStatus = 'published';
    mutate({ data: { status: newStatus }, id });
    await updateSearchObject([{ objectID: id, status: newStatus }]);
  };

  const handleDraftChange = async () => {
    const newStatus = 'draft';
    mutate({ data: { status: newStatus }, id });
    await updateSearchObject([{ objectID: id, status: newStatus }]);
  };

  const statusInfo = [
    {
      heading: 'Published',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">public</span> and viewable
          by anyone. Noticeboard subscribers will be notified by email.
        </p>
      ),
    },
    {
      heading: 'Draft',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">private</span> and only
          viewable by members of your organisation. Noticeboard subscribers will
          not be notified by email.
        </p>
      ),
    },
    {
      heading: 'Archived',
      content: (
        <p className="text-small text-gray-500">
          The notice is{' '}
          <span className="font-bold text-indigo-600">private</span> and only
          viewable within the archive tab of the noticeboard. Noticeboard
          subscribers will not be notified by email.
        </p>
      ),
    },
  ];

  return (
    <div className="border bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
      <div className="flex place-content-between">
        <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
          Notice Status
        </h2>
        <Badge status={status}>{status}</Badge>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Change the status of the notice.
      </p>

      <div className="mt-4 flex flex-col justify-stretch">
        <Dropdown
          status={status}
          handleArchiveChange={handleArchiveChange}
          handlePublishChange={handlePublishChange}
          handleDraftChange={handleDraftChange}
        />
      </div>

      {/* Status */}
      <div className="flow-root">
        <ul className="">
          {statusInfo.map((item) => (
            <li className="my-4" key={item.heading}>
              <div className="text-sm text-indigo-600">{item.heading}</div>
              <div className="text-sm">{item.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatusController;
