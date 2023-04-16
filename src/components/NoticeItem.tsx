import type { FC } from 'react';
import type { Notice } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import type { RouterOutputs } from '../utils/trpc';
import { trpc } from '../utils/trpc';
import dayjs from 'dayjs';
import PdfViewer from './PdfViewer';
import DropdownMenu from './DropdownMenu';
import Badge from './Badge';
/*
 * import { render } from '@react-email/render';
 * import { ExampleTemplate } from '../../emails/ExampleTemplate';
 * import { sendEmail } from "../pages/api/sendEmail";
 */

type NoticeItemProps = {
  notice: RouterOutputs['notice']['infiniteList']['notices'][number];
  toggle: () => void;
  handleFetchPreviousPage: () => void;
  notices:
    | (Notice & {
        author: {
          id: string;
          name: string | null;
        };
      })[]
    | undefined;
};

const NoticeItem: FC<NoticeItemProps> = ({
  notice,
  toggle,
  handleFetchPreviousPage,
  notices,
}) => {
  const queryClient = useQueryClient();

  const { id, title, startDate, endDate, status, uploadUrl, author } = notice;

  const deleteMutation = trpc.notice.delete.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      if (notices?.length === 1) {
        handleFetchPreviousPage();
      }
    },
  });

  const deleteMutationLoadingState = deleteMutation.isLoading;

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const updateMutation = trpc.notice.updateStatus.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toggle();
    },

    /*
     * not working
     *   try {
     *     const html = render(<ExampleTemplate />);
     *     await sendEmail({
     *       to: "mwzavattaro@icloud.com",
     *       subject: "Hello from Next.js!",
     *       html,
     *     });
     *   } catch (error) {
     *     console.log(error);
     *   }
     * },
     * onError: (error) => {
     *   console.log(error);
     * },
     */
  });

  const handlePublishChange = () => {
    const newStatus = 'published';
    updateMutation.mutate({ data: { status: newStatus }, id });
  };

  const handleDraftChange = () => {
    const newStatus = 'draft';
    updateMutation.mutate({ data: { status: newStatus }, id });
  };

  const handleArchiveChange = () => {
    const newStatus = 'archived';
    updateMutation.mutate({ data: { status: newStatus }, id });
  };

  const noticePeriod = `${dayjs(startDate).format('D MMM YYYY')} -
  ${dayjs(endDate).format('D MMM YYYY')}`;

  return (
    <div
      key={id}
      className="col-span-1 flex flex-col rounded border bg-white shadow"
    >
      <div className="-mt-px flex divide-x divide-gray-200 border-b text-center">
        <div className="my-2 flex w-full flex-col justify-center">
          <p className="text-xs font-semibold uppercase sm:text-sm">
            notice period
          </p>
          <p className="text-xs text-gray-500 sm:text-sm">{noticePeriod}</p>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col">
        <div className="aspect-[1/1.414] flex-shrink-0">
          <PdfViewer uploadUrl={uploadUrl} />
        </div>
        <div className="mt-4 border-t px-4 pb-4">
          <div className="align mt-1 w-full text-center">
            <Badge status={status}>{status}</Badge>
          </div>

          <h3 className="mb-2 mt-2 text-sm font-semibold text-gray-900 line-clamp-2 sm:mt-4 sm:text-base">
            {title}
          </h3>
          <div className="flex place-content-between items-center">
            <div className="flex flex-col sm:w-40">
              <span className="text-sm text-gray-900">Uploaded by</span>
              <span className="w-26 truncate text-sm text-gray-500 sm:w-40">
                {author.name}
              </span>
            </div>
            <DropdownMenu
              handleDelete={handleDelete}
              handlePublishChange={handlePublishChange}
              handleDraftChange={handleDraftChange}
              handleArchiveChange={handleArchiveChange}
              uploadUrl={uploadUrl}
              deleteMutationLoadingState={deleteMutationLoadingState}
              status={status}
              id={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeItem;
