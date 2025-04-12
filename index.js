import * as mongoUtils from './fetchData.js';
import express from 'express'; // or: const express = require('express');
import cors from 'cors';

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/api/problemset.problems', async (req, res) => {
	const problems = await mongoUtils.returnData();

	res.status(200).json(problems[0]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
