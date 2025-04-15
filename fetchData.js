import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load .env from config folder
dotenv.config();

const password = process.env.PASSWORD;
const username = 'kodomotachi2k4';

// Connection URL and Database Name
const url = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'problemset';
const collectionName = 'problems';

const client = new MongoClient(url);

async function returnData() {
  try {
    // Connect to MongoDB first
    await client.connect();
    console.log("Connected to MongoDB successfully");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.find({}).toArray();
    console.log(`Retrieved ${result.length} documents from MongoDB`);
    
    return result;
  } catch (err) {
    console.error("Error retrieving data from MongoDB:", err);
    throw err; // Re-throw to allow calling code to handle errors
  } finally {
    // Only close the connection if it's open
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }
}

export { returnData };