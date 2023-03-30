import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import { useBuildingComplexIdStore } from '../../../../store/useBuildingComplexIdStore';
import { useNoticePageStore } from '../../../../store/useNoticePageStore';
import Header from '../../../../components/Header';
import Modal from '../../../../components/Modal';
import GridLayout from '../../../../components/GridLayout';
import NoticeItem from '../../../../components/NoticeItem';
import Container from '../../../../components/Container';
import StyledLink from '../../../../components/StyledLink';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import useModal from '../../../../utils/useModal';
import NotFoundPage from '../../../404';
import type NoticeboardProps from '../../noticeboard/index';
import Pagination from '../../../../components/Pagination';

const Archived: FC<typeof NoticeboardProps> = () => {
  const [page, setPage] = useState(0);
  const { isShowing, toggle } = useModal();
  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();
  const cancelButtonRef = useRef(null);
  const id = useRouter().query.buildingId as string;

  const setBuildingComplexId = useBuildingComplexIdStore(
    (state) => state.setBuildingComplexId
  );

  const setNoticePage = useNoticePageStore((state) => state.setNoticePage);

  const buildingComplexQuery = trpc.buildingComplex.byId.useQuery({ id });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    trpc.notice.archived.useInfiniteQuery(
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

  const { name, streetAddress, suburb } = buildingComplexData;

  const buildingComplexAddress = `${streetAddress || ''}, ${suburb || ''}`;

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

      <Header toggle={toggle} />

      <div className="mx-auto mt-4 flex max-w-lg flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">{name || ''}</p>
        <p className="text-xs md:text-sm">
          {buildingComplexData ? buildingComplexAddress : ''}
        </p>
      </div>

      {buildingComplexData && !isFetching ? (
        <GridLayout
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        >
          {notices?.map((notice) => (
            <NoticeItem
              notices={notices}
              handleFetchPreviousPage={handleFetchPreviousPage}
              key={notice.id}
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
      ) : (
        <span>notices.length broke</span>
      )}

      {buildingComplexData && Boolean(notices?.length) && !isFetching && (
        <Pagination
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
          hasNextPage={hasNextPage}
          nextCursor={nextCursor}
        />
      )}
    </Container>
  );
};

export default Archived;
