// insertProblems.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://kodomotachi2k4:XeHv73dxBLB7T0Ut@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const dbName = 'problemset';
const collectionName = 'problems';
const codeforcesUrl = 'https://codeforces.com/api/problemset.problems';

async function fetchAndInsertProblems() {
  try {
    // fetch tích hợp sẵn (Node.js v18+)
    const response = await fetch(codeforcesUrl);
    const data = await response.json();
    console.log("Fetched data:", data.status);

    if (data.status !== 'OK') {
      throw new Error('Failed to fetch data from Codeforces');
    }

	  const problems = data.result.problems;
	  const problemStatistics = data.result.problemStatistics;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({}); // Optional: clear old data
    const insertResult = await collection.insertOne({status: "OK", result: { problems: problems, problemStatistic: problemStatistics }});
    // console.log(`Inserted ${insertResult.insertedCount} problems into MongoDB`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

fetchAndInsertProblems();
