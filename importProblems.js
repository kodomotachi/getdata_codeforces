import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const username = "kodomo_tachi";
const password = process.env.PASSWORD;

const codeforcesUrl = "https://codeforces.com/api/problemset.problems";
const mongodbUrl = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(mongodbUrl);
const dbName = "problemset";
const collectionName = "problems";

async function updateData() {
	try {
		const response = await fetch(codeforcesUrl);
		const data = await response.json();

		if (data.status === "OK") {
			const db = client.db(dbName);
			const collection = db.collection(collectionName);

			await collection.deleteMany({});
			collection.insertOne(data);
		}
	} catch (err) {
		console.error("Error: ", err);
	} finally {
		await client.close();
	}
}

export { updateData };