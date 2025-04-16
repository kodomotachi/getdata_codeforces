import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const username = "kodomotachi2k4"; // Using consistent username
const password = process.env.PASSWORD;

const codeforcesUrl = "https://codeforces.com/api/user.status?handle=";
const mongodbUrl = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(mongodbUrl);
const dbName = "user";
const collectionName = "status"; // Changed collection name to users for user data

async function pingCheck(handle) {
	try {
		await client.connect(); 

		const db = client.db(dbName);
		const collection = db.collection(collectionName);

		const data = await collection.find({ handle: handle }).toArray();

		return data;
	} catch (err) {
		console.error("Error: ", err);
	} finally {
		await client.close();
	}
}

export { pingCheck };
