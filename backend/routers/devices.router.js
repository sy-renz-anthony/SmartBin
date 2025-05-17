import express from 'express';
import {getAllDevices, registerNewDevice, updateDevice, searchDevice} from '../controllers/device.controller.js';
import userAuthentication from '../functions/userAuthentication.js';

const router =express.Router();

router.get("/all", userAuthentication, getAllDevices);
router.get("/search", userAuthentication, searchDevice);
router.post("/register", userAuthentication, registerNewDevice);
router.put("/update/:id", userAuthentication, updateDevice);

export default router;