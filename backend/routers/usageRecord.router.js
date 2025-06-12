import express from 'express';
import {recordUsageEvent, retrieveUsageRecord} from '../controllers/usageRecord.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.post("/usage-event-occured", recordUsageEvent);
router.post("/search-record", userAuthentication, retrieveUsageRecord);


export default router;