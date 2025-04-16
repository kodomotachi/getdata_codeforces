import * as mongoUtils from './fetchData.js'; 
import * as codeforcesUtils from './ping.js';
import * as userData from './importUser.js';
import express from 'express'; // or: const express = require('express');
import './updateByTime.js';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

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
	const handle = req.query.handle;
	
	if (!handle) {
		return res.status(400).json({ status: "FAILED", comment: "handle parameter is required" });
	}
	
	const lowercaseHandle = handle.toLowerCase();

	if (lowercaseHandle === "") {
		res.status(400).json({ status: "FAILED", comment: "handle: Field should contain between 3 and 24 characters, inclusive"})
	} else {
		const checkPing = await userData.pingCheck(lowercaseHandle);
		
		if (checkPing === true) {
			const fetchUserDataFromCodeforces = await userData.fetchUserDataFromCodeforces(handle);
			
			res.status(200).json(fetchUserDataFromCodeforces);
		}
	}
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
