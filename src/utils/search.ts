import algoliasearch from 'algoliasearch';
import { getSession } from 'next-auth/react';

type searchProps = {
  noticeId: string | undefined;
  title: string;
  fileName: string;
  status: string;
};

if (
  !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ||
  !process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY
) {
  throw new Error('Missing Algolia env variables');
}

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY
);

export const fetchAndIndexData = async (
  searchData: searchProps
): Promise<void> => {
  const session = await getSession();

  const jsonObject = JSON.parse(
    localStorage.getItem('buildingComplexId') ?? ''
  ) as {
    state: { id: string };
  };

  const { id } = jsonObject.state;
  const index = searchClient.initIndex('brisby-core');

  const data = {
    objectID: searchData.noticeId,
    visible_by: [session?.user.organisationId, id],
    organisationId: session?.user.organisationId,
    buildingComplexId: id,
    noticeId: searchData.noticeId,
    title: searchData.title,
    fileName: searchData.fileName,
    status: searchData.status,
  };

  await index.saveObjects([data], { autoGenerateObjectIDIfNotExist: true });
};

export const deleteSearchObject = async (objectID: string): Promise<void> => {
  const index = searchClient.initIndex('brisby-core');
  await index.deleteObject(objectID);
};
