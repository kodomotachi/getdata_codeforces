import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load .env from config folder
dotenv.config();

const password = process.env.PASSWORD;
const username = 'kodomotachi2k4'

// Connection URL and Database Name
const url = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?appName=Cluster0`;
// const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'problemset';
const collectionName = 'problems';

const client = new MongoClient(url);

async function returnData() {
  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.find({}).toArray();

    return result;
  } catch (err) {
    console.error("Error: ", err);
  } finally {
    await client.close();
  }
}

export { returnData };