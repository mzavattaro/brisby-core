import type { Notice } from '@prisma/client';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useBuildingComplexIdStore } from '../../../store/useBuildingComplexIdStore';
import { useNoticePageStore } from '../../../store/useNoticePageStore';
import { trpc } from '../../../utils/trpc';
import Header from '../../../components/Header';
import GridLayout from '../../../components/GridLayout';
import NoticeItem from '../../../components/NoticeItem';
import Container from '../../../components/Container';
// import ToastNofication from '../../../components/ToastNotification';
import useModal from '../../../utils/useModal';
import InfoBox from '../../../components/InfoBox';
import StyledLink from '../../../components/StyledLink';
import Modal from '../../../components/Modal';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import NotFoundPage from '../../404';
import Pagination from '../../../components/Pagination';

export type NoticeboardProps = {
  notices:
    | (Notice & {
        author: {
          id: string;
          name: string | null;
        };
      })[]
    | undefined;
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
  handleFetchNextPage: () => void;
  handleFetchPreviousPage: () => void;
  nextCursor: string | undefined;
};

const Noticeboard: FC<NoticeboardProps> = ({
  notices,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  buildingComplexData,
  queryBuildingId,
  handleFetchNextPage,
  handleFetchPreviousPage,
  nextCursor,
}) => {
  const { toggle } = useModal();
  const { isShowing: isShowingModal, toggle: toggleModal } = useModal();

  const cancelButtonRef = useRef(null);

  const { name, streetAddress, suburb } = buildingComplexData;

  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();

  const buildingComplexAddress = `${streetAddress || ''}, ${suburb || ''}`;

  console.log(notices?.length);

  return (
    <Container className="text-gray-900">
      <Modal
        isShowing={isShowingModal}
        hide={toggleModal}
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
        <ul className="h-96 w-full divide-y divide-gray-200 overflow-scroll rounded-lg border">
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
                onClick={toggleModal}
                type="link"
                href={{
                  pathname: '/[buildingId]/noticeboard',
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

      <Header toggle={toggleModal} />

      <div className="mx-auto mt-4 flex max-w-lg flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">{name || ''}</p>
        <p className="text-xs md:text-sm">{buildingComplexAddress}</p>
      </div>

      {!isFetching && (
        <GridLayout
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        >
          {notices?.map((notice) => (
            <NoticeItem
              notices={notices}
              key={notice.id}
              handleFetchPreviousPage={handleFetchPreviousPage}
              notice={notice}
              toggle={toggle}
            />
          ))}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center font-bold text-slate-300">
              Fetching notices...
            </div>
          )}
        </GridLayout>
      )}

      {Boolean(notices?.length === 0) && !isFetching && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <InfoBox>
            <h3 className="text-base font-bold">Notices</h3>
            <p className="text-sm">
              Notices represent important information that your building
              residents need to be notified about.
            </p>
            <p className="mt-4 text-sm">
              A notice&apos;s status can be changed depending on when your
              building residents need to be notified. View a list of notices
              within your settings. Create a notice by clicking the{' '}
              <b>Create notice </b>
              button below.
            </p>
            <StyledLink
              type="button"
              href={{
                pathname: '/[buildingId]/noticeboard/notice/new',
                query: { buildingId: queryBuildingId },
              }}
              className="mt-4 px-4 text-sm"
            >
              Create notice
            </StyledLink>
          </InfoBox>
        </div>
      )}

      {Boolean(notices?.length) && !isFetching && (
        <Pagination
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
          hasNextPage={hasNextPage}
          nextCursor={nextCursor}
        />
      )}

      {/* <ToastNofication isShowing={isShowing} toggle={toggle} /> */}
    </Container>
  );
};

const NoticeboardViewPage: FC = () => {
  const id = useRouter().query.buildingId as string;
  const [page, setPage] = useState(0);

  const setBuildingComplexId = useBuildingComplexIdStore(
    (state) => state.setBuildingComplexId
  );

  const setNoticePage = useNoticePageStore((state) => state.setNoticePage);

  const buildingComplexQuery = trpc.buildingComplex.byId.useQuery({ id });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    trpc.notice.infiniteList.useInfiniteQuery(
      {
        limit: 8,
        id,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleFetchNextPage = async () => {
    try {
      await fetchNextPage();
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
      return;
    }
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  setNoticePage(page);

  useEffect(() => {
    setBuildingComplexId(id);
  }, [id, setBuildingComplexId]);

  if (buildingComplexQuery.error) {
    return <NotFoundPage />;
  }

  if (buildingComplexQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data: buildingComplexData } = buildingComplexQuery;

  const notices = data?.pages[page]?.notices;
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <Noticeboard
      buildingComplexData={buildingComplexData}
      notices={notices}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      queryBuildingId={id}
      handleFetchNextPage={handleFetchNextPage}
      handleFetchPreviousPage={handleFetchPreviousPage}
      nextCursor={nextCursor}
    />
  );
};

export default NoticeboardViewPage;
