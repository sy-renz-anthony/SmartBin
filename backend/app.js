import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { dbConnectionString } from './config/db.js';
import deviceRouters from './routers/devices.router.js';
import userRouters from './routers/user.router.js';
import usageRouters from './routers/usageRecord.router.js';
import eventRouters from './routers/eventRecord.router.js';

import checkOfflineDevices from './functions/checkOfflineDevices.js';

const secretPath =
  fs.existsSync('/etc/secrets/.env')
    ? '/etc/secrets/.env' // Render.com
    : './etc/secrets/.env'; // Local

dotenvConfig({ path: secretPath });

const app=express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null")
      return callback(null, false);

    return callback(null, origin);
  },
  credentials: true
}));

app.use("/api/devices", deviceRouters);
app.use("/api/users", userRouters);
app.use("/api/usages", usageRouters);
app.use("/api/events", eventRouters);

setInterval(checkOfflineDevices, 60000);

app.listen(PORT, ()=>{
    dbConnectionString();
    console.log("server started at http://localhost:"+PORT);
});