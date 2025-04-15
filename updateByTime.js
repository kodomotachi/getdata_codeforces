import cron from "node-cron";
import * as codeforcesUtils from './ping.js';
import { updateData } from './importProblems.js';

cron.schedule('0 12 * * *', async () => {
	const pingCheck = await codeforcesUtils.pingCheck();

	if (pingCheck === true) {
		await updateData();		
	} 
});