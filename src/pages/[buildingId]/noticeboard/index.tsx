import type { Notice } from "@prisma/client";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStore } from "../../../store/useStore";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import useScrollPosition from "../../../utils/useScrollPosition";
import Header from "../../../components/Header";
import GridLayout from "../../../components/GridLayout";
import NoticeItem from "../../../components/NoticeItem";
import Container from "../../../components/Container";
import ToastNofication from "../../../components/ToastNotification";
import useModal from "../../../utils/useModal";
import ScrollVertical from "../../../../public/ScrollVertical";
import InfoBox from "../../../components/InfoBox";
import StyledLink from "../../../components/StyledLink";
import Modal from "../../../components/Modal";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "../../../utils/classNames";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import NotFoundPage from "../../404";

type NoticeboardProps = {
  notices: (Notice & {
    author: {
      id: string;
      name: string | null;
    };
  })[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  buildingComplexData: {
    id: string;
    name: string;
    streetAddress: string;
    suburb: string;
  };
  queryBuildingId: string;
};

const Noticeboard: FC<NoticeboardProps> = ({
  notices,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  buildingComplexData,
  queryBuildingId,
}) => {
  const { isShowing, toggle } = useModal();
  const cancelButtonRef = useRef(null);

  const { name, streetAddress, suburb } = buildingComplexData;

  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();

  const buildingComplexAddress = `${streetAddress || ""}, ${suburb || ""}`;

  return (
    <Container className="text-gray-900">
      <Modal
        isShowing={isShowing}
        hide={toggle}
        cancelButtonRef={cancelButtonRef}
        className="h-112"
      >
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Select Building Complex
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Select the building complex to view its notices.
            </p>
          </div>
          <div className="sticky mt-6 mb-2">
            <h4>All building complexes</h4>
          </div>
        </div>
        <ul
          role="list"
          className="h-96 w-full divide-y divide-gray-200 overflow-scroll rounded-lg border"
        >
          {buildingComplexes?.map((buildingComplex) => (
            <li
              key={buildingComplex.id}
              className="flex w-full flex-row place-content-between p-2 sm:items-center sm:p-4"
            >
              <div>
                <p className="text-sm">{buildingComplex.name}</p>
                <p className="text-xs text-gray-500">
                  {buildingComplex.streetAddress}, {buildingComplex.suburb}
                </p>
              </div>
              <StyledLink
                type="link"
                href={{
                  pathname: "/[buildingId]/noticeboard",
                  query: { buildingId: buildingComplex.id },
                }}
                className="mt-2 flex flex-row items-center sm:mt-0"
              >
                <p>View</p>
                <ArrowLongRightIcon className="ml-1 h-6 w-6" />
              </StyledLink>
            </li>
          ))}
        </ul>

        <div className="flex justify-center text-left">
          <StyledLink
            type="button"
            href="/building/new"
            className="mt-4 px-4 text-sm"
          >
            Create a new building
          </StyledLink>
        </div>
      </Modal>

      <Header toggle={toggle} />

      <div className="mx-auto mt-4 flex max-w-md flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">{name || ""}</p>
        <p className="text-xs md:text-sm">
          {buildingComplexData ? buildingComplexAddress : ""}
        </p>
      </div>

      {buildingComplexData && notices.length > 0 && !isFetching && (
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

      {buildingComplexData && notices.length === 0 && !isFetching && (
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
              href={{
                pathname: "/[buildingId]/noticeboard/notice/new",
                query: { buildingId: queryBuildingId },
              }}
              className="mt-4 px-4 text-sm"
            >
              Create notice
            </StyledLink>
          </InfoBox>
        </div>
      )}

      {/* <ToastNofication isShowing={isShowing} toggle={toggle} /> */}
    </Container>
  );
};

const NoticeboardViewPage = () => {
  const id = useRouter().query.buildingId as string;
  const setBuildingComplexId = useStore((state) => state.setBuildingComplexId);

  const buildingComplexQuery = trpc.buildingComplex.byId.useQuery({ id });
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
      id: id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    setBuildingComplexId(id);
  }, [id, setBuildingComplexId]);

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage().catch(console.error);
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  if (buildingComplexQuery.error) {
    return <NotFoundPage />;
  }

  if (buildingComplexQuery.status !== "success") {
    return <>Loading...</>;
  }

  const { data: buildingComplexData } = buildingComplexQuery;

  const notices = data?.pages.flatMap((page) => page.notices) ?? [];

  return (
    <Noticeboard
      buildingComplexData={buildingComplexData}
      notices={notices}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      queryBuildingId={id}
    />
  );
};

export default NoticeboardViewPage;
