import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { metrics } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", readiness);
app.get("/admin/reset", reset);
app.get("/admin/metrics", metrics);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
