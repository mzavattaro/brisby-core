import type { ChangeEvent, FC, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useBuildingComplexIdStore } from '../../../store/useBuildingComplexIdStore';
import { trpc } from '../../../utils/trpc';
import Header from '../../../components/Header';
import Container from '../../../components/Container';
import ToolBar from '../../../components/ToolBar';
import useModal from '../../../utils/useModal';
import InfoBox from '../../../components/InfoBox';
import StyledLink from '../../../components/StyledLink';
import { useQueryClient } from '@tanstack/react-query';
import NoticeTable from '../../../components/NoticeTable';
import { usePreviousUrlStore } from '../../../store/usePreviousUrl';
import SearchModal from '../../../components/modals/SearchModal';
import StrataTitleModal from '../../../components/modals/StrataTitleModal';
import Unauthorised from '../../unauthorised';
import LoadingSpinner from '../../../components/LoadingSpinner';

type BuildingComplexProps = {
  name: string;
  streetAddress: string;
  suburb: string;
} | null;

export type NoticeProps =
  | {
      id: string;
      author: { name: string | null };
      title: string;
      fileName: string;
      status: string | null;
      startDate: Date | null;
      endDate: Date | null;
    }[]
  | undefined;

type NoticeboardProps = {
  notices: NoticeProps;
  buildingComplex: BuildingComplexProps | undefined;
  isFetching: boolean;
  queryBuildingId: string;
  setSortOrder: (val: SetStateAction<SortOrder>) => void;
  setLimit: (val: SetStateAction<number>) => void;
};

export enum SortOrder {
  ascending = 'asc',
  descending = 'desc',
}

const Noticeboard: FC<NoticeboardProps> = ({
  notices,
  isFetching,
  buildingComplex,
  queryBuildingId,
  setSortOrder,
  setLimit,
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<NoticeProps>([]);

  const { isShowing: isShowingModal, toggle: toggleModal } = useModal();
  const { isShowing: isShowingSearchModal, toggle: toggleSearchModal } =
    useModal();
  const cancelButtonRef = useRef(null);
  const queryClient = useQueryClient();
  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();

  const router = useRouter();
  const setPreviousUrl = usePreviousUrlStore((state) => state.setPreviousUrl);

  const buildingComplexAddress = `${buildingComplex?.streetAddress ?? ''}, ${
    buildingComplex?.suburb ?? ''
  }`;

  const extractIds = (inputArray: NoticeProps) => {
    const idArray = [] as string[];
    inputArray?.forEach((obj) => {
      if ('id' in obj) {
        idArray.push(obj.id);
      }
    });
    return idArray;
  };

  const ids = extractIds(selectedDocument);

  const { mutate } = trpc.notice.archiveManyNotices.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      setSelectedDocument([]);
      setChecked(false);
      setIndeterminate(false);
    },
  });

  const handleBulkArchive = () => {
    mutate({ data: { status: 'archived' }, ids });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setLimit(value);
  };

  const handleNextPage = () => {
    setPreviousUrl(router.asPath);
  };

  useEffect(() => {
    if (notices && selectedDocument) {
      const isIndeterminate =
        selectedDocument.length > 0 && selectedDocument.length < notices.length;
      setChecked(selectedDocument.length === notices.length);

      setIndeterminate(isIndeterminate);
      if (checkbox.current) {
        checkbox.current.indeterminate = isIndeterminate;
      }
    }
  }, [selectedDocument, notices]);

  const toggleAll = () => {
    setSelectedDocument(checked || indeterminate ? [] : notices);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  return (
    <Container className="text-gray-900">
      <StrataTitleModal
        isShowing={isShowingModal}
        hide={toggleModal}
        cancelButtonRef={cancelButtonRef}
        toggle={toggleModal}
        buildingComplexes={buildingComplexes}
        handleNextPage={handleNextPage}
      />
      <SearchModal
        isShowing={isShowingSearchModal}
        hide={toggleSearchModal}
        cancelButtonRef={cancelButtonRef}
      />

      <Header toggle={toggleModal} toggleSearch={toggleSearchModal} />

      <div className="mx-auto mt-4 flex max-w-lg flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">
          {buildingComplex?.name ?? ''}
        </p>
        <p className="text-xs md:text-sm">{buildingComplexAddress}</p>
      </div>

      <ToolBar
        setSortOrder={setSortOrder}
        handleSelectChange={handleSelectChange}
      />

      <NoticeTable
        queryBuildingId={queryBuildingId}
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
        checked={checked}
        checkbox={checkbox}
        toggleAll={toggleAll}
        handleBulkArchive={handleBulkArchive}
        notices={notices}
      />

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
    </Container>
  );
};

const NoticeboardViewPage: FC<SortOrder> = () => {
  const { data: sessionData } = useSession();
  const id = useRouter().query.buildingId as string;
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.descending);
  const [limit, setLimit] = useState<number>(10);

  const setBuildingComplexId = useBuildingComplexIdStore(
    (state) => state.setBuildingComplexId
  );

  const buildingComplexQuery = trpc.buildingComplex.byId.useQuery({ id });

  const { data: listAllNotices, isFetching } = trpc.notice.listAll.useQuery({
    id,
    orderBy: sortOrder,
    limit,
  });

  useEffect(() => {
    setBuildingComplexId(id);
  }, [id, setBuildingComplexId]);

  if (sessionData === null) {
    return <Unauthorised />;
  }

  if (buildingComplexQuery.isFetching) {
    return <LoadingSpinner />;
  }

  const { data: buildingComplexData } = buildingComplexQuery;

  return (
    <Noticeboard
      buildingComplex={buildingComplexData}
      notices={listAllNotices}
      isFetching={isFetching}
      queryBuildingId={id}
      setSortOrder={setSortOrder}
      setLimit={setLimit}
    />
  );
};

export default NoticeboardViewPage;
