import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const username = "kodomotachi2k4";
const password = process.env.PASSWORD;

const codeforcesUrl = "https://codeforces.com/api/contest.list?gym=";
const mongodbUrl = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(mongodbUrl);
const dbName = "contest";
const collectionName = "list";

async function pingCheck(gymContest) {
	const response = await fetch(codeforcesUrl + gymContest);
	const data = await response.json();

	if (data.status === "OK") {
		return true;
	} else {
		return false;
	}
}

async function dataContest(gymContest) {
	const response = await fetch(codeforcesUrl + gymContest);	
	const data = await response.json();

	if (data.status === "OK") {
		try {
			await client.connect();

			const db = client.db(dbName);
			const collection = db.collection(collectionName);
			
			// Create document with consistent format
            const documentToStore = {
                check: gymContest,
                status: data.status,
                result: data.result  // This is already an array from the API
            };

			await collection.updateOne(
				{ check: "true" },
				{ $set: documentToStore },
				{ upsert: true }
			);

			console.log("Data is up-to-date");
		} catch (err) {
			console.error("Error: ", err);
		} finally {
			await client.close();
		}

		return data;
	} else {
		try {
			await client.connect();

			const db = client.db(contest);
			const collection = db.collection(collectionName);

			const result = await collection.findOne({ check: gymContest }).toArray();

			return result;
		} catch (err) {
			console.error("Error: ", err);
		} finally {
			await client.close();
		}
	}
}

async function getDataFromDatabase(gymContest) {
	try {
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection(collectionName);
		
		const data = await collection.find({ check: gymContest });

		return data;
	} catch (err) {
		console.error("Error: ", err);
	} finally {
		await client.close();
	}
}

export { dataContest, getDataFromDatabase, pingCheck };