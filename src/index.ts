// console.log("Hello via Bun!");

import express from 'express';

const app = express()

app.get('/abc', (req, res) => {
	res.send("Hello, World!");
});

app.listen(8000, () => {
	console.log("Server started on port 8000");
});