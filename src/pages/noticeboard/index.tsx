import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Modal from "../../components/Modal";
import useScrollPosition from "../../utils/useScrollPosition";

const Noticeboard: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    trpc.notice.list.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const notices = data?.pages.flatMap((page) => page.notices) ?? [];

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="text-gray-900">
      {/* <div className="relative">
          <Modal />
        </div> */}
      <Header />
      <GridLayout>
        {notices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} />
        ))}
      </GridLayout>
      {!hasNextPage && <span>NO MORE NOTICES</span>}
    </div>
  );
};

export default Noticeboard;
