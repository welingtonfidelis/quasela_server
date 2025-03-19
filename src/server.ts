import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "express-async-errors";
import https from "https";
import fs from "fs";
import path from "path";

import { router } from "./route";
import { config } from "./config";

const { PORT, CORS_DOMAINS, CERTIFICATE_KEY, CERTIFICATE_CERT } = config;

const allowedOrigins = CORS_DOMAINS.split(",").map((item) => item.trim());
const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(router);

// const options = {
//   key: fs.readFileSync(CERTIFICATE_KEY),
//   cert: fs.readFileSync(CERTIFICATE_CERT),
// };

// PROD
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server running in ${PORT}\n`);
// });

// LOCAL/DEV
app.listen(PORT, function () {
  console.log(`Server running in ${PORT}\n`);
});
