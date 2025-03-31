import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import { performRender } from "./features/render/render.controller";
import { validateRenderRequest } from "./middlewares/validation.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export const createApp = (): express.Application => {
  const app = express.default();

  app.use(cors.default());
  app.use(morgan.default("dev"));
  app.use(express.default.json({ limit: "50mb" }));
  app.use(express.default.urlencoded({ extended: true, limit: "50mb" }));

  const v1Router = express.default.Router();
  v1Router.post("/render", validateRenderRequest, performRender);
  app.use("/v1", v1Router);

  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });

  app.use(errorHandler);

  return app;
};
