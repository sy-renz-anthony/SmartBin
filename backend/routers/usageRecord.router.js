import express from 'express';
import {recordUsageEvent, retrieveUsageRecord, retrieveChartValuesThisWeek, binFullError, binEmptiedEvent} from '../controllers/usageRecord.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.post("/usage-event-occured", recordUsageEvent);
router.post("/search-record", userAuthentication, retrieveUsageRecord);
router.get("/chart-values", userAuthentication, retrieveChartValuesThisWeek);
router.post("/bin-full", binFullError);
router.post("/bin-emptied", binEmptiedEvent);

export default router;