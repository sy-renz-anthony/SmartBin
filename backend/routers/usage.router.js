import express from 'express';
import {garbageBinUsed} from '../controllers/usage.controller.js';

const router =express.Router();

router.post("/usage-event-occured", garbageBinUsed);


export default router;