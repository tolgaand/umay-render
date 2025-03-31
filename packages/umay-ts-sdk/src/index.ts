// src/umay-sdk.ts
import { HttpClient } from "./http-client";
import { loadConfig, UmayConfig } from "./config";
import { z } from "zod";

import {
  ConversionRequestSchema,
  RenderInput,
  ConversionRequest,
} from "./schemas";
import { UmayError, ErrorCodes } from "./errors";

export class UmaySDK {
  private httpClient: HttpClient;
  private config: UmayConfig;

  constructor(config?: Partial<UmayConfig>) {
    const mergedConfig = loadConfig(process.env);
    Object.assign(mergedConfig, config);
    this.config = mergedConfig;
    this.httpClient = new HttpClient(this.config);
  }

  async render(request: RenderInput): Promise<Uint8Array> {
    let validatedPayload: ConversionRequest;

    try {
      validatedPayload = ConversionRequestSchema.parse(request);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        console.error("SDK Input Validation Error:", error.flatten());
        throw new UmayError(
          ErrorCodes.SDK_INVALID_INPUT,
          `Invalid input provided to the SDK: ${validationErrors}`,
          error.flatten()
        );
      }

      console.error("Unexpected error during SDK input validation:", error);
      let errorMessage =
        "An unexpected error occurred during SDK input processing.";
      if (error instanceof Error) {
        errorMessage = `Unexpected SDK error: ${error.message}`;
      }
      throw new UmayError(
        ErrorCodes.SDK_UNEXPECTED_PROCESSING_ERROR,
        errorMessage,
        error
      );
    }

    const endpoint = "/render";
    return this.httpClient.request<Uint8Array>(endpoint, validatedPayload);
  }
}

export * from "./schemas";
export * from "./errors";
