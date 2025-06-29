import express from 'express';
import { retrieveEventRecord } from '../controllers/eventRecord.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.post("/search-record", userAuthentication, retrieveEventRecord);

export default router;