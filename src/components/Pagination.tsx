import type { FC } from 'react';
import { useNoticePageStore } from '../store/useNoticePageStore';
import { classNames } from '../utils/classNames';

type PaginationProps = {
  handleFetchPreviousPage: () => void;
  handleFetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  nextCursor: string | null | undefined;
};

const Pagination: FC<PaginationProps> = ({
  handleFetchPreviousPage,
  handleFetchNextPage,
  hasNextPage,
  nextCursor,
}) => {
  const noticePage = useNoticePageStore((state) => state.page);

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white py-3"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          className={classNames(
            'relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0',
            noticePage === 0
              ? 'cursor-not-allowed text-gray-400'
              : 'text-gray-900 hover:bg-gray-50'
          )}
          disabled={noticePage === 0}
          type="button"
          onClick={() => handleFetchPreviousPage()}
        >
          Previous
        </button>
        <button
          className={classNames(
            'relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0',
            nextCursor
              ? 'text-gray-900 hover:bg-gray-50'
              : 'cursor-not-allowed text-gray-400'
          )}
          disabled={!nextCursor || !hasNextPage}
          type="button"
          onClick={() => handleFetchNextPage()}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
