import express from 'express';
import "dotenv/config";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { dbConnectionString } from './config/db.js';
import deviceRouters from './routers/devices.router.js';
import userRouters from './routers/user.router.js';
import usageRouters from './routers/usage.router.js';


dotenv.config();

const app=express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
/*suppose to be, we need to specify here the url of the frontend server where we deploy our frontend, since it is still in development and not yet uploaded to a server, this is just a temporary work around for allowing all urls to connect to our backend while strictly enforcing to use jwt tokens saved on cookies*/
app.use(cors({
  origin: (origin, callback) => {
    // Allow all local development origins
    callback(null, true);
  },
  credentials: true,
}));

app.use("/api/devices", deviceRouters);
app.use("/api/users", userRouters);
app.use("/api/usages", usageRouters);


app.get("/", (req, res) => {
    res.send("Server is Ready!");
});

app.listen(PORT, ()=>{
    dbConnectionString();
    console.log("server started at http://localhost:"+PORT);
});