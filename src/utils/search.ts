import { algoliasearch } from 'algoliasearch';
import { getSession } from 'next-auth/react';

type searchProps = {
  organisationId: string;
  title: string;
  fileName: string;
};

const client = algoliasearch('5P8ZL9I43T', '44b33d64681c0653b806328b4e66dd4c');

const fetchAndIndexData = async (searchData: searchProps) => {
  const session = await getSession();

  const jsonObject = JSON.parse(
    localStorage.getItem('buildingComplexId') ?? ''
  ) as {
    state: { id: string };
  };

  const { id } = jsonObject.state;

  // Add a new record to your Algolia index
  const { taskID } = await client.saveObject({
    indexName: 'brisby-core',
    body: {
      visible_by: [session?.user.organisationId, id],
      organisationId: session?.user.organisationId,
      buildingComplexId: id,
      title: searchData.title,
      fileName: searchData.fileName,
    },
  });

  // Poll the task status to know when it has been indexed
  await client.waitForTask({ indexName: 'brisby-core', taskID });
};

export default fetchAndIndexData;
