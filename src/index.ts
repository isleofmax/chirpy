import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { metrics } from "./api/metrics.js";
import { validateChirp } from "./api/validate_chirp.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());

app.get("/api/healthz", readiness);
app.get("/admin/metrics", metrics);

app.post("/api/validate_chirp", validateChirp);
app.post("/admin/reset", reset);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
