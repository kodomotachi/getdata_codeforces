import * as mongoUtils from './fetchData.js'; 
import * as codeforcesUtils from './ping.js';
import * as userData from './importUser.js';
import { dataContest, getDataFromDatabase, pingCheck } from './importContest.js';
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
		res.status(400).json({ status: "FAILED", comment: "handle parameter is required" });
	}
	
	const lowercaseHandle = handle.toLowerCase();

	if (lowercaseHandle.length < 3 || lowercaseHandle.length > 24) {
		res.status(400).json({ status: "FAILED", comment: "handle: Field should contain between 3 and 24 characters, inclusive"})
	} else {
		const checkPing = await userData.pingCheck(lowercaseHandle);
		
		if (checkPing === true) {
			const fetchUserDataFromCodeforces = await userData.fetchUserDataFromCodeforces(handle);
			
			res.status(200).json(fetchUserDataFromCodeforces);
		} else {
			res.status(400).json({ "status": "FAILED", "comment": `handle: User with handle ${lowercaseHandle} not found` });
		}
	}
});

app.get('/api/contest.list', async (req, res) => {
	const gymContest = req.query.gym;
	const check = await pingCheck();

	if (check === true) {
		const data = await dataContest(gymContest);

		res.status(200).json(data);
	} else {
		const data = await getDataFromDatabase(gymContest);

		res.status(200).json(data[0]);
	}
});

// Use for Notion
app.get('/api/notion/user.status', async (req, res) => {
	const handle = req.query.handle;

	const codeforcesUrl = "https://codeforces.com/api/user.status?handle=";
	const response = await fetch(codeforcesUrl + handle);
	const data = await response.json();

	res.status(200).json(data.result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
