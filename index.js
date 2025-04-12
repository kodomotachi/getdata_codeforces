import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const password = process.env.PASSWORD;
const username = 'kodomotachi2k4'

// Connection URL and Database Name
// const url = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?appName=Cluster0`;
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'problemset';
const collectionName = 'problems';

const client = new MongoClient(url);

// async function findProblemByName(keyword) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     const results = await collection.find({
//       name: { $regex: keyword, $options: "i" }
//     }).toArray();

//     return results;
//     // console.log(`Found ${results.length} problems containing "${keyword}":`);
//     // console.log(results);
//   } catch (err) {
//     console.error("Error during find:", err);
//     return []; // when database got error, just return an empty array
//   } finally {
//     await client.close();
//   }
// }

// async function findSolveCountByName(contestId, index) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection('problemStatistics');

//     const results = await collection.find({
//       contestId: { $regex: contestId, $options: "i" },
//       index: { $regex: index, $options: "i" }
//     });

//     return results;
//     // console.log(`Found ${results.length} problems containing "${keyword}":`);
//     // console.log(results);
//   } catch (err) {
//     console.error("Error during find:", err);
//     return []; // when database got error, just return an empty array
//   } finally {
//     await client.close();
//   }
// }

const findProblemWithStats = async (keyword) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const doc = await collection.findOne({}); // lấy document duy nhất bạn đang dùng (có thể refine nếu cần)

    const problems = doc.result.problems;
    const stats = doc.result.problemStatistics;

    // Tìm theo tên keyword trong problems, và nối với solvedCount từ stats
    const filtered = problems
      .filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
      .map(p => {
        const stat = stats.find(s =>
          s.contestId === p.contestId && s.index === p.index
        );  
        return {
          name: p.name,
          type: p.type,
          tags: p.tags,
          solvedCount: stat ? stat.solvedCount : null
        };
      });

    return filtered;
  } catch (err) {
    console.error("Error:", err);
    return [];
  } finally {
    await client.close();
  }
};

export { findProblemWithStats };