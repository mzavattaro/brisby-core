import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import useScrollPosition from "../../utils/useScrollPosition";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Container from "../../components/Container";
import ScrollVertical from "../../../public/ScrollVertical";

const Noticeboard: NextPage = () => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    error,
  } = trpc.notice.list.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const notices = data?.pages.flatMap((page) => page.notices) ?? [];
  const scrollPosition = useScrollPosition();
  0;

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  if (error) return <>`An error has occurred: ${error.message}`</>;

  return (
    <Container className="text-gray-900">
      <Header />

      {notices.length > 0 ? (
        <GridLayout
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        >
          {notices.map((notice) => (
            <NoticeItem
              // handleModal={handleModal}
              key={notice.id}
              notice={notice}
            />
          ))}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center font-bold text-slate-300">
              <ScrollVertical />
              <span>Scroll for more notices</span>
            </div>
          )}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center font-bold text-slate-300">
              Fetching notices...
            </div>
          )}
        </GridLayout>
      ) : (
        <div className="flex flex-col items-center justify-center font-bold text-slate-300">
          <span>Start by uploading a notice</span>
        </div>
      )}

      {notices.length > 0 && !hasNextPage && (
        <div className="mx-auto mt-4 flex flex-col items-center pb-4 font-bold text-slate-300">
          <span className="mx-auto">There are no more notices</span>
        </div>
      )}
    </Container>
  );
};

export default Noticeboard;
