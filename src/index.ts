import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { reset } from "./api/reset.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", middlewareMetricsInc, readiness);
app.get("/reset", reset);
app.get("/metrics", )

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
