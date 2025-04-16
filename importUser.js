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
	const response = await fetch(codeforcesUrl + handle);
	const data = await response.json();

	if (data.status === "OK") {
		try {
			await client.connect();

			console.log("Connected to MongoDB successfully");

			const db = client.db(dbName);
			const collection = db.collection(collectionName);
			
			await collection.updateOne(
				{ handle: handle },
				{ $set: { handle: handle, status: "OK", result: data } },
				{ upsert: true }
			);
			console.log(`User data for ${handle} successfully imported to MongoDB`);
		} catch (err) {
			console.error("Error: ", err);
		} finally {
			await client.close();
		}

		return true;
	} else {
		return false;
	}}

async function fetchUserDataFromCodeforces(handle) {
	try {
		const response = await fetch(codeforcesUrl + handle);
		const data = await response.json();

		return data;
	} catch (err) {
		console.error("Error: ", err);
	}
}

 // Export the function instead of immediately calling it
 export { updateUser, pingCheck };