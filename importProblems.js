import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const username = "kodomotachi2k4"; // Consistent username across files
const password = process.env.PASSWORD;

const codeforcesUrl = "https://codeforces.com/api/problemset.problems";
const mongodbUrl = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(mongodbUrl);
const dbName = "problemset";
const collectionName = "problems";

async function updateData() {
	try {
		// Connect to MongoDB first
		await client.connect();
		console.log("Connected to MongoDB successfully");
		
		const response = await fetch(codeforcesUrl);
		const data = await response.json();

		if (data.status === "OK") {
			const db = client.db(dbName);
			const collection = db.collection(collectionName);

			await collection.deleteMany({});
			await collection.insertOne(data); // Add await here
			console.log("Data successfully imported to MongoDB");
		} else {
			console.error("Codeforces API returned non-OK status:", data.status);
		}
	} catch (err) {
		console.error("Error during data update:", err);
	} finally {
		// Only close the connection if it's open
		if (client && client.topology && client.topology.isConnected()) {
			await client.close();
			console.log("MongoDB connection closed");
		}
	}
}

export { updateData };