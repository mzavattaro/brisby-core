import type { Notice } from '@prisma/client';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useBuildingComplexIdStore } from '../../../store/useBuildingComplexIdStore';
import { useNoticePageStore } from '../../../store/useNoticePageStore';
import { trpc } from '../../../utils/trpc';
import Header from '../../../components/Header';
/*
 * import GridLayout from '../../../components/GridLayout';
 * import NoticeItem from '../../../components/NoticeItem';
 */
import Container from '../../../components/Container';
// import ToastNofication from '../../../components/ToastNotification';
import useModal from '../../../utils/useModal';
import InfoBox from '../../../components/InfoBox';
import StyledLink from '../../../components/StyledLink';
import Modal from '../../../components/Modal';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import NotFoundPage from '../../404';
import { classNames } from '../../../utils/classNames';
// import Pagination from '../../../components/Pagination';
import dayjs from 'dayjs';
import Link from 'next/link';

export type NoticeboardProps = {
  notices:
    | (Notice & {
        author: {
          id: string;
          name: string | null;
        };
      })[];

  isFetching: boolean;
  /*
   * isFetchingNextPage: boolean;
   * hasNextPage: boolean | undefined;
   */
  buildingComplexData: {
    name: string;
    streetAddress: string;
    suburb: string;
    notice: Notice[];
    id: string;
    // createdAt: Date;
    type: string;
    totalOccupancies: number;
  } | null;
  queryBuildingId: string;
  /*
   * handleFetchNextPage: () => void;
   * handleFetchPreviousPage: () => void;
   * nextCursor: string | undefined;
   */
};

const Noticeboard: FC<NoticeboardProps> = ({
  notices,
  isFetching,
  /*
   * isFetchingNextPage,
   * hasNextPage,
   */
  buildingComplexData,
  queryBuildingId,
  /*
   * handleFetchNextPage,
   * handleFetchPreviousPage,
   * nextCursor,
   */
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<
    (Notice & {
      author: {
        id: string;
        name: string | null;
      };
    })[]
  >([]);
  // const { toggle } = useModal();
  const { isShowing: isShowingModal, toggle: toggleModal } = useModal();

  const cancelButtonRef = useRef(null);

  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();

  const buildingComplexAddress = `${
    buildingComplexData?.streetAddress ?? ''
  }, ${buildingComplexData?.suburb ?? ''}`;

  useEffect(() => {
    const isIndeterminate =
      selectedDocument.length > 0 && selectedDocument.length < notices.length;
    setChecked(selectedDocument.length === notices.length);
    setIndeterminate(isIndeterminate);

    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedDocument, notices]);

  const toggleAll = () => {
    setSelectedDocument(checked || indeterminate ? [] : notices);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

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
        <p className="text-sm font-bold md:text-lg">
          {buildingComplexData?.name ?? ''}
        </p>
        <p className="text-xs md:text-sm">{buildingComplexAddress}</p>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle">
              <div className="relative">
                {selectedDocument.length > 0 && (
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Bulk edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Delete all
                    </button>
                  </div>
                )}
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      <th
                        scope="col"
                        className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        File name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Start period
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        End period
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {notices.map((notice) => (
                      <tr
                        key={notice.id}
                        className={
                          selectedDocument.includes(notice)
                            ? 'bg-gray-50'
                            : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedDocument.includes(notice) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={notice.id}
                            checked={selectedDocument.includes(notice)}
                            onChange={(event) =>
                              setSelectedDocument(
                                event.target.checked
                                  ? [...selectedDocument, notice]
                                  : selectedDocument.filter(
                                      (document) => document !== notice
                                    )
                              )
                            }
                          />
                        </td>
                        <td
                          className={classNames(
                            'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                            selectedDocument.includes(notice)
                              ? 'text-indigo-600'
                              : 'text-gray-900'
                          )}
                        >
                          {notice.fileName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notice.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {dayjs(notice.startDate).format('D MMMM YYYY')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {dayjs(notice.endDate).format('D MMMM YYYY')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notice.author.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notice.status}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <Link
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit<span className="sr-only">, {notice.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {!isFetching && (
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
      )} */}

      {Boolean(notices.length === 0) && !isFetching && (
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

      {/* {Boolean(notices?.length) && !isFetching && (
        <Pagination
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
          hasNextPage={hasNextPage}
          nextCursor={nextCursor}
        />
      )} */}

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

  const { data, isFetchingNextPage, isFetching } =
    trpc.notice.infiniteList.useInfiniteQuery(
      {
        limit: 8,
        id,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  /*
   * const handleFetchNextPage = async () => {
   *   try {
   *     await fetchNextPage();
   *   } catch (error) {
   *     if (error instanceof Error) {
   *       // eslint-disable-next-line no-console
   *       console.log(error.message);
   *     }
   *     return;
   *   }
   *   setPage((prev) => prev + 1);
   * };
   */

  /*
   * const handleFetchPreviousPage = () => {
   *   setPage((prev) => prev - 1);
   * };
   */

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
  // const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <Noticeboard
      buildingComplexData={buildingComplexData}
      notices={notices}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      queryBuildingId={id}
      // hasNextPage={hasNextPage}
      /*
       * handleFetchNextPage={handleFetchNextPage}
       * handleFetchPreviousPage={handleFetchPreviousPage}
       * nextCursor={nextCursor}
       */
    />
  );
};

export default NoticeboardViewPage;
