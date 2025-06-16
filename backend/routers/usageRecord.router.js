import express from 'express';
import {recordUsageEvent, retrieveUsageRecord, retrieveChartValuesThisWeek} from '../controllers/usageRecord.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.post("/usage-event-occured", recordUsageEvent);
router.post("/search-record", userAuthentication, retrieveUsageRecord);
router.get("/chart-values", userAuthentication, retrieveChartValuesThisWeek);

export default router;