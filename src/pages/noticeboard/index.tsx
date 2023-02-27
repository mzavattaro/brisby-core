import type { NextPage } from "next";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import useScrollPosition from "../../utils/useScrollPosition";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Container from "../../components/Container";
import ToastNofication from "../../components/ToastNotification";
import useModal from "../../utils/useModal";
import ScrollVertical from "../../../public/ScrollVertical";
import InfoBox from "../../components/InfoBox";
import StyledLink from "../../components/StyledLink";
import { useSession } from "next-auth/react";

const Noticeboard: NextPage = () => {
  const { isShowing, toggle } = useModal();
  const { data: sessionData } = useSession();
  const { data: user } = trpc.user.byId.useQuery({
    id: sessionData?.user?.id,
  });

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    error,
  } = trpc.notice.infiniteList.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const notices = data?.pages.flatMap((page) => page.notices) ?? [];
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage().catch(console.error);
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  if (error) return <>`An error has occurred: ${error.message}`</>;

  const buildingComplexAddress = `${
    user?.buildingComplex?.streetAddress || ""
  }, ${user?.buildingComplex?.suburb || ""}`;

  console.log("bComplex index page: ", user?.buildingComplex?.name);

  return (
    <Container className="text-gray-900">
      <Header />
      <div className="mx-auto mt-4 flex max-w-md flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">
          {user?.buildingComplex?.name || ""}
        </p>
        <p className="text-xs md:text-sm">
          {user?.buildingComplex ? buildingComplexAddress : ""}
        </p>
      </div>
      {user?.buildingComplex && notices.length > 0 && !isFetching && (
        <GridLayout
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        >
          {notices.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} toggle={toggle} />
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
      )}

      {!user?.buildingComplex && notices.length === 0 && !isFetching && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <InfoBox>
            <h3 className="text-base font-bold">Building Complex</h3>
            <p className="text-sm">
              Before you can create a notice, first create a building complex
              that you notify.
            </p>
            <p className="mt-4 text-sm">
              You can create or edit multiple building complexes within your
              settings. Or you can get started by clicking the{" "}
              <b>Create building </b>button below.
            </p>
            <StyledLink
              type="button"
              href="/building/new"
              className="mt-4 px-4 text-sm"
            >
              Create a new building
            </StyledLink>
          </InfoBox>
        </div>
      )}

      {user?.buildingComplex && notices.length === 0 && !isFetching && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <InfoBox>
            <h3 className="text-base font-bold">Notices</h3>
            <p className="text-sm">
              Building notices represent important information that your
              building residents need to know.
            </p>
            <p className="mt-4 text-sm">
              Notice status can be changed depending on when your building
              residents need to be notified. View a list of notices within your
              settings. Create a notice by clicking the <b>Create notice </b>
              button below.
            </p>
            <StyledLink
              type="button"
              href="/notice/new"
              className="mt-4 px-4 text-sm"
            >
              Create notice
            </StyledLink>
          </InfoBox>
        </div>
      )}

      <ToastNofication isShowing={isShowing} hide={toggle} />
    </Container>
  );
};

export default Noticeboard;
