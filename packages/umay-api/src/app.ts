import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import { renderPDF, renderImage } from "./features/render/render.controller";
import { validateRenderRequest } from "./middlewares/validation.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export const createApp = (): express.Application => {
  const app = express.default();

  // Middlewares
  app.use(cors.default());
  app.use(morgan.default("combined"));
  app.use(express.default.json());

  // Routes
  // v1 API endpoints
  const v1Router = express.default.Router();

  v1Router.post("/render/pdf", validateRenderRequest, renderPDF);
  v1Router.post("/render/image", validateRenderRequest, renderImage);

  app.use("/v1", v1Router);

  app.get("/health", (_req, res) => {
    res.sendStatus(200);
  });

  // Error Handling
  app.use(errorHandler);

  return app;
};
