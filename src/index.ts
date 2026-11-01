import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { metrics } from "./api/metrics.js";
import { validateChirp } from "./api/validate_chirp.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(readiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(metrics(req, res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(validateChirp(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(reset(req, res)).catch(next);
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
