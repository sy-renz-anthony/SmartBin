import express from 'express';
import { retrieveVolumeRecordBase, retrieveVolumeRecordGroupGarbageType, retrieveVolumeRecordGroupGarbageTypeLocation } from '../controllers/volumeRecord.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.post("/search-record", userAuthentication, retrieveVolumeRecordBase);
router.post("/search-record/group-by/garbage-type", userAuthentication, retrieveVolumeRecordGroupGarbageType);
router.post("/search-record/group-by/location", userAuthentication, retrieveVolumeRecordGroupGarbageTypeLocation);

export default router;