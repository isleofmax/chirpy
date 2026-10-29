import express, { type Express } from "express";
import { readiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware.js";

const app: Express = express();
const port = 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", middlewareLogResponses, readiness);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
