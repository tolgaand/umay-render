import { Request, Response, NextFunction, RequestHandler } from "express";
import { RenderService } from "./render.service";
import { AppError } from "../../middlewares/error.middleware";
import { ConversionRequest } from "../../schemas/render.schema";

const renderService = new RenderService();

export const performRender: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversionRequest: ConversionRequest = req.body;

    console.log(
      "Controller received validated request:",
      JSON.stringify(conversionRequest, null, 2)
    );
    const fileBuffer: Buffer = await renderService.performConversion(
      conversionRequest
    );

    if (
      !fileBuffer ||
      !Buffer.isBuffer(fileBuffer) ||
      fileBuffer.length === 0
    ) {
      console.error(
        "performConversion returned invalid buffer for validated request:",
        conversionRequest
      );
      throw new AppError(
        500,
        "Generated output is invalid or empty",
        "Conversion failed",
        "EMPTY_OUTPUT"
      );
    }

    let contentType: string;
    let extension: string = conversionRequest.outputFormat;

    switch (conversionRequest.outputFormat) {
      case "pdf":
        contentType = "application/pdf";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "jpeg":
        contentType = "image/jpeg";
        extension = "jpg";
        break;
      case "webp":
        contentType = "image/webp";
        break;
    }

    const filename: string =
      conversionRequest.filename || `output.${extension}`;

    res.set({
      "Content-Type": contentType,
      "Content-Length": fileBuffer.length.toString(),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        filename
      )}`,
    });

    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};
