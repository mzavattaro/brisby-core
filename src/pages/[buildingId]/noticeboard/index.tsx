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
import { CheckIcon } from "@heroicons/react/24/outline";
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

        <RadioGroup>
          {/* value={selected} onChange={setSelected} */}
          <RadioGroup.Label className="sr-only">
            Privacy setting
          </RadioGroup.Label>
          <div className="h-96 -space-y-px divide-y overflow-scroll rounded-md border">
            {buildingComplexes?.map((buildingComplex, buildingComplexIdx) => (
              <RadioGroup.Option
                key={buildingComplex.name}
                value={buildingComplex}
                className={({ checked }) =>
                  classNames(
                    "relative flex w-full cursor-pointer p-4 focus:outline-none",
                    buildingComplexIdx === 0
                      ? "rounded-tl-md rounded-tr-md"
                      : "",
                    buildingComplexIdx === buildingComplexes.length - 1
                      ? "rounded-bl-md rounded-br-md"
                      : "",
                    checked
                      ? "z-10 border-indigo-200 bg-indigo-50"
                      : "border-gray-200"
                  )
                }
              >
                {({ checked }) => (
                  <Link
                    href={{
                      pathname: "/[buildingId]/noticeboard",
                      query: { buildingId: buildingComplex.id },
                    }}
                    className="flex w-full flex-row place-content-between items-center"
                  >
                    <span className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={classNames(
                          checked ? "text-indigo-900" : "text-gray-900",
                          "block text-sm font-medium"
                        )}
                      >
                        {buildingComplex.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={classNames(
                          checked ? "text-indigo-700" : "text-gray-500",
                          "block text-sm"
                        )}
                      >
                        {buildingComplex.streetAddress}
                      </RadioGroup.Description>
                    </span>
                    <CheckIcon
                      className={classNames(
                        "mt-0.5 h-6 w-6 shrink-0 items-center justify-center",
                        checked
                          ? "block text-indigo-500"
                          : "hidden border-gray-300 bg-white"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
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

      {!buildingComplexData && notices.length === 0 && !isFetching && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <InfoBox>
            <h3 className="text-base font-bold">Building Complex</h3>
            <p className="text-sm">
              Before you can create a notice, first create a new building
              complex that will contain all the building&apos;s notices.
            </p>
            <p className="mt-4 text-sm">
              You can create or edit multiple building complexes within your
              settings. Or you can get started by clicking the{" "}
              <b>Create a new building </b>button.
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
              href="/notice/new"
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