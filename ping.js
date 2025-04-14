const codeforcesUrl = "https://codeforces.com/api/problemset.problems";

async function pingCheck() {
	try {
		const response = await fetch(codeforcesUrl);
		const data = await response.json();

		if (data.status === "OK") {
			return true;
		}
		else {
			return false;
		}
	} catch (err) {
		console.error("Error: ", err);
	}
}

async function fetchFromCodeforces() {
	try {
		const response = await fetch(codeforcesUrl);
		const data = await response.json();

		return data;
	} catch (err) {
		console.error("Error: ", err);
	}
}

export { pingCheck, fetchFromCodeforces };