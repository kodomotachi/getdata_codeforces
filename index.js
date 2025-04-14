import * as mongoUtils from './fetchData.js'; 
import * as codeforcesUtils from './ping.js';
import express from 'express'; // or: const express = require('express');
import './updateByTime.js';

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
