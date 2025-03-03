// src/umay-sdk.ts
import { HttpClient } from "./http-client";
import { loadConfig, UmayConfig } from "./config";
import {
  PdfOptions,
  ImageOptions,
  PdfOptionsSchema,
  ImageOptionsSchema,
} from "./schemas";

export class UmaySDK {
  private httpClient: HttpClient;

  constructor(config?: Partial<UmayConfig>) {
    const mergedConfig = loadConfig(process.env);
    Object.assign(mergedConfig, config);
    this.httpClient = new HttpClient(mergedConfig);
  }

  async toPDF(html: string, options?: PdfOptions): Promise<Buffer> {
    const validatedOptions = options
      ? PdfOptionsSchema.parse(options)
      : PdfOptionsSchema.parse({});
    return this.httpClient.request<Buffer>("/render/pdf", {
      html,
      options: validatedOptions,
    });
  }

  async toImage(html: string, options?: ImageOptions): Promise<Buffer> {
    const validatedOptions = options
      ? ImageOptionsSchema.parse(options)
      : ImageOptionsSchema.parse({});
    const payload = {
      html,
      options: validatedOptions,
    };
    return this.httpClient.request<Buffer>("/render/image", payload);
  }
}
