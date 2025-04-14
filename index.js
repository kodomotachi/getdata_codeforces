import * as mongoUtils from './fetchData.js'; 
import * as codeforcesUtils from './ping.js';
import express from 'express'; // or: const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', async (req, res) => {
	const pingCheck = await codeforcesUtils.pingCheck();

	if (pingCheck === true) {
		const fetchFromCodeforces = await codeforcesUtils.fetchFromCodeforces();

		res.status(200).json(fetchFromCodeforces);
	}
	// const problems = await mongoUtils.returnData();

	// res.status(200).json(problems[0]);
//   res.send('Hello from localhost!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
