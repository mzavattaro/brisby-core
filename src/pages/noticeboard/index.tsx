import { useEffect } from "react";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import useScrollPosition from "../../utils/useScrollPosition";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Modal from "../../components/Modal";
import Container from "../../components/Container";
import ScrollVertical from "../../../public/ScrollVertical";
import axios from "axios";

const Noticeboard: NextPage = () => {
  // console.log(trpc.notice.delete.useMutation());
  // const deletePostClicked = async ({ id }) => {
  //   console.log(`deletePostClicked = (${id})`);
  //   await axios.delete("/api/posts/" + id);
  // };

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
    <Container className="text-gray-900">
      {/* <div className="relative">
          <Modal />
        </div> */}
      <Header />
      <GridLayout>
        {notices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} />
        ))}
        {hasNextPage && (
          <div className="flex flex-col items-center justify-center font-bold text-slate-200">
            <ScrollVertical />
            <span>Scroll for more notices</span>
          </div>
        )}
      </GridLayout>
      {!hasNextPage && (
        <div className="mx-auto flex flex-col items-center pb-4 text-slate-300">
          <span className="mx-auto">
            Congratulations, you've reached the bottom!
          </span>
        </div>
      )}
    </Container>
  );
};

export default Noticeboard;
