import { PrismaClient } from '@prisma/client';
import algoliasearch from 'algoliasearch';

const prisma = new PrismaClient();
const algoliaClient = algoliasearch('YOUR_APPLICATION_ID', 'YOUR_API_KEY');
const index = algoliaClient.initIndex('your_index_name');

async function fetchAndIndexData() {
  // Fetch data from Prisma
  const data = await prisma.yourModel.findMany();

  // Transform data into Algolia records
  const records = data.map((item) => ({
    objectID: item.id,
    // other attributes you want to index
  }));

  // Send records in batches to Algolia
  index.saveObjects(records, (err, content) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Data indexed successfully');
    }
  });
}

fetchAndIndexData();
