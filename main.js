import * as mongoUtils from './index.js';
import express from 'express'; // or: const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', async (req, res) => {
	const problems = await mongoUtils.findProblemWithStats("geometry");
	// const problemStatistics = await mongoUtils.findSolveCountByName("geometry");

	if (problems.length === 0)
		res.status(404).json({ status: "FAILED", result: problems });
	else 
		res.status(200).json({ status: "OK", result: problems });
//   res.send('Hello from localhost!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
