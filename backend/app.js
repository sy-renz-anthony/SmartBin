import express from 'express';
import "dotenv/config";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from 'http-proxy-middleware';

import { dbConnectionString } from './config/db.js';
import deviceRouters from './routers/devices.router.js';
import userRouters from './routers/user.router.js';
import usageRouters from './routers/usage.router.js';

import checkOfflineDevices from './functions/checkOfflineDevices.js';

dotenv.config();

const app=express();

// --- ADD THIS LOGGING MIDDLEWARE AT THE VERY TOP ---
app.use((req, res, next) => {
    console.log(`[GLOBAL REQUEST LOG] URL: ${req.url}, Method: ${req.method}, Host: ${req.headers.host}`);
    next(); // Pass control to the next middleware
});
// --- END GLOBAL LOGGING MIDDLEWARE ---

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null") 
      return callback(null, false); // block null origins

    return callback(null, origin);
  },
  credentials: true
}));

const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY;

console.log("Backend GRAPHHOPPER_API_KEY status on startup:", GRAPHHOPPER_API_KEY ? "Loaded" : "NOT LOADED");
app.use(
  '/route',
  createProxyMiddleware({
    target: 'https://graphhopper.com/api',
    changeOrigin: true,
    pathRewrite: {
      '^/route': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      if (GRAPHHOPPER_API_KEY) {
          const originalPath = proxyReq.path;
          const separator = originalPath.includes('?') ? '&' : '?';
          proxyReq.path = `${originalPath}${separator}key=${GRAPHHOPPER_API_KEY}`;
          console.log(`[Proxy] Added GraphHopper API key. New path: ${proxyReq.path}`);
      } else {
          console.warn("[Proxy] GRAPHHOPPER_API_KEY not found, proxying without API key.");
      }
    },
    onError: (err, req, res) => {
        console.error('[Proxy Error to GraphHopper]:', err);
        res.status(504).send('Routing service unavailable or timed out from backend.');
    },
    timeout: 60000,
    proxyTimeout: 60000
  })
);

app.use("/api/devices", deviceRouters);
app.use("/api/users", userRouters);
app.use("/api/usages", usageRouters);


setInterval(checkOfflineDevices, 60000);

app.listen(PORT, ()=>{
    dbConnectionString();
    console.log("server started at http://localhost:"+PORT);
});