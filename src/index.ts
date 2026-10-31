import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { metrics } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", readiness);
app.get("/reset", reset);
app.get("/metrics", metrics);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
