/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routers";
import DBContext from "./entities";
import bodyParser from "body-parser";
import middlewares from "./middlewares";
import RedisContext from "./cache/redis";
import Mailer from "./helpers/mailer";
const path = require("path");
dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const db = DBContext.connect();

const redis = RedisContext.connect();
redis.on("error", (err: any) => console.log("Redis Client Error", err));
redis.connect();
const fs = require("fs");
const app = express();

// Init Mailer
Mailer.connect();

/** init tables */
// db.sequelize
//   .sync({ alter: true })
//   // db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err: any) => {
//     console.log("Failed to sync db: " + err.message);
//   });

/** init values */
// DBContext.initValues()
//   .then(() => {
//     console.log("Created initial data success.");
//   })
//   .catch((err: any) => {
//     console.log("Created initial data failure: " + err.message);
//   });

/**
 *  App Configuration
 */

// create upload folder for the tables
var dir = path.join(
  __dirname,
  process.env.UPLOAD_PATH,
  process.env.FOLDER_EVENT
);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
dir = path.join(__dirname, process.env.UPLOAD_PATH, process.env.FOLDER_PROJECT);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
dir = path.join(__dirname, process.env.UPLOAD_PATH, process.env.FOLDER_NEWS);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
dir = path.join(__dirname, process.env.UPLOAD_PATH, process.env.FOLDER_USERS);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use('/upload', router);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use(middlewares.globleMiddleware);
app.use(middlewares.queryOptionsMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
console.log(__dirname);
process.env.ROOT_FOLDER = __dirname;

router(app);

/**
 * Server Activation
 */
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`Domain local is http://localhost:${PORT}`);
});

/**
 * Webpack HMR Activation
 */
type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
