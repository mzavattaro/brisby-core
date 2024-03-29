import { useSession } from 'next-auth/react';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import { useBuildingComplexIdStore } from '../store/useBuildingComplexIdStore';
import type { FC, ReactNode } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import type { SearchBoxProps } from 'react-instantsearch-hooks-web';
import { searchClient } from '../utils/search';
import Link from 'next/link';
import { classNames } from '../utils/classNames';
import Badge from './Badge';

type HitProps = {
  hit: {
    noticeId: string;
    title: string;
    fileName: string;
    status: string;
  };
};

type NoResultsBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

const queryHook: SearchBoxProps['queryHook'] = (query, search) => {
  search(query);
};

const NoResultsBoundary: FC<NoResultsBoundaryProps> = ({
  children,
  fallback,
}) => {
  const { results } = useInstantSearch();

  // eslint-disable-next-line no-underscore-dangle
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <div className="px-3">
        {fallback}
        <div hidden>{children}</div>
      </div>
    );
  }

  return <div>{children}</div>;
};

const NoResults: FC = () => {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="absolute left-0 h-52 w-[512px] rounded-lg bg-white px-3 pb-4 text-center">
      {indexUiState.query === undefined ? (
        <p className="font-sem text-slate-400">Start searching for notices.</p>
      ) : (
        <p className="break-words">
          No results for <q>{indexUiState.query}</q>.
        </p>
      )}
    </div>
  );
};

const Hit: FC<HitProps> = ({ hit }) => {
  const buildingComplexId = useBuildingComplexIdStore((state) => state.id);

  return (
    <Link
      href={{
        pathname: `/[buildingId]/noticeboard/notice/${hit.noticeId}`,
        query: { buildingId: buildingComplexId },
      }}
      className="cursor-pointer"
    >
      <div className="flex flex-row items-center justify-between rounded-md px-2 py-1 hover:bg-gray-100">
        <div>
          <h4 className="font-bold">{hit.title}</h4>
          <p className="font-italised">{hit.fileName}</p>
        </div>
        <Badge status={hit.status}>{hit.status}</Badge>
      </div>
    </Link>
  );
};

const Search: FC = () => {
  const { data: sessionData } = useSession();
  const buildingComplexId = useBuildingComplexIdStore((state) => state.id);
  const organisationId = sessionData?.user.organisationId ?? '';
  const filters = `visible_by:${organisationId} AND visible_by:${buildingComplexId}`;

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="brisby-core"
      routing={{ router: createInstantSearchRouterNext({ singletonRouter }) }}
    >
      <Configure filters={filters} />
      <SearchBox
        queryHook={queryHook}
        searchAsYouType
        placeholder="Search notices..."
        classNames={{
          input:
            'block w-full pr-3 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600 rounded-md focus:ring-1',
          submitIcon: 'hidden',
          reset: 'hidden',
          loadingIcon: 'hidden',
        }}
      />
      <NoResultsBoundary fallback={<NoResults />}>
        <Hits
          className={classNames(
            'absolute left-0 h-52 w-full overflow-auto rounded-lg bg-white px-3 pb-4'
          )}
          hitComponent={Hit}
        />
      </NoResultsBoundary>
    </InstantSearch>
  );
};

export default Search;
