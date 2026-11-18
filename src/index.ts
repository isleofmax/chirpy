import express, { type Express } from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { metrics } from "./api/metrics.js";
import { users, updateUser } from "./api/users.js";
import { polkaWebhooks } from "./api/polka.js";
import { login } from "./api/login.js";
import { refresh } from "./api/refresh.js";
import { revoke } from "./api/revoke.js";
import { createNewChirp, getChirpsByCreation, getChirpById, deleteChirp } from "./api/chirps.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";
import { config } from "./config.js";

const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

const app: Express = express();
const port = config.apiConfig.port;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(getChirpsByCreation(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(getChirpById(req, res)).catch(next);
});
app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(readiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(metrics(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(reset(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(users(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(createNewChirp(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(refresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(revoke(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(polkaWebhooks(req, res)).catch(next);
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(updateUser (req, res)).catch(next);
});

app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(deleteChirp (req, res)).catch(next);
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
