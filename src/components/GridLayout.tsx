import type { ReactNode, FC } from 'react';

type GridLayoutProps = {
  children: ReactNode;
  isFetching: boolean;
  isFetchingNextPage: boolean;
};

const GridLayout: FC<GridLayoutProps> = ({
  children,
  isFetching,
  isFetchingNextPage,
}) => {
  if (isFetching && !isFetchingNextPage) return <>Fetching notices</>;

  return (
    <div
      role="list"
      className="mx-auto grid max-w-lg grid-cols-2 gap-6 pt-6 pb-12 sm:max-w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {children}
    </div>
  );
};

export default GridLayout;
