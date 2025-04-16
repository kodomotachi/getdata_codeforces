import * as mongoUtils from './fetchData.js'; 
import * as codeforcesUtils from './ping.js';
import * as userData from './importUser.js';
import { pingCheck } from './testing.js'; // just test mongodb
import express from 'express'; // or: const express = require('express');
import './updateByTime.js';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// get problems dataset
app.get('/api/problemset.problems', async (req, res) => {
	const pingCheck = await codeforcesUtils.pingCheck();

	if (pingCheck === true) {
		const fetchFromCodeforces = await codeforcesUtils.fetchFromCodeforces();

		// console.log(fetchFromCodeforces);
		res.status(200).json(fetchFromCodeforces);
	} else {
		const data = await mongoUtils.returnData();

		res.status(200).json(data[0]);
	}
});

// get user's submission from request
app.get('/api/user.status', async (req, res) => {
	try {
		const handle = req.query.handle;
		
		if (!handle) {
			return res.status(400).json({ status: "FAILED", comment: "handle parameter is required" });
		}
		
		const lowercaseHandle = handle.toLowerCase();

		if (lowercaseHandle === "") {
			return res.status(400).json({ status: "FAILED", comment: "handle: Field should contain between 3 and 24 characters, inclusive"});
		} else {
			const data = await pingCheck(lowercaseHandle);

			// Check if data exists and has elements before accessing index 0
			if (data && data.length > 0) {
				return res.status(200).json(data[0]);
			} else {
				// Fallback to fetching data directly from Codeforces API
				try {
					const codeforcesData = await userData.fetchUserDataFromCodeforces(lowercaseHandle);
					if (codeforcesData) {
						return res.status(200).json(codeforcesData);
					} else {
						return res.status(404).json({ status: "FAILED", comment: "User data not found" });
					}
				} catch (error) {
					console.error("Error fetching from Codeforces:", error);
					return res.status(500).json({ status: "FAILED", comment: "Error fetching user data" });
				}
			}
		}
	} catch (error) {
		console.error("Error in user.status endpoint:", error);
		return res.status(500).json({ status: "FAILED", comment: "Internal server error" });
	}
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
