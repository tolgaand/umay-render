// src/http-client.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UmayError } from "./errors";
import { ErrorCodes } from "./errors";
import { UmayConfig } from "./config";

export class HttpClient {
  private client: AxiosInstance;
  private config: UmayConfig;

  constructor(config: UmayConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.API_URL,
      timeout: config.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, image/*, application/pdf",
      },
      responseType: "arraybuffer", // For handling PDF and image responses
      validateStatus: (status) => status < 500, // Don't reject status codes < 500
    });
  }

  async request<T>(endpoint: string, data: any): Promise<T> {
    try {
      console.log(
        `Making ${endpoint} request with data:`,
        typeof data === "object" ? JSON.stringify(data) : data
      );

      const response = await this.client.post(endpoint, data, {
        headers: {
          Accept: "application/json, image/*, application/pdf",
        },
      });

      console.log(`Received response from ${endpoint}:`, {
        status: response.status,
        contentType: response.headers["content-type"],
        dataType: typeof response.data,
        dataLength: response.data?.length,
      });

      return this.processResponse<T>(response);
    } catch (error) {
      console.error("HTTP client error:", error);
      if (axios.isAxiosError(error)) {
        let errorMessage = error.message;
        if (error.response?.data) {
          try {
            const text = new TextDecoder().decode(error.response.data);
            try {
              const json = JSON.parse(text);
              errorMessage = json.details || json.error || error.message;
            } catch (parseError) {
              // If not JSON, use text as error message
              errorMessage = text || error.message;
            }
          } catch (e) {
            console.error("Error parsing API error response:", e);
          }
        }
        throw new UmayError(
          ErrorCodes.API_ERROR,
          `API request failed: ${errorMessage}`,
          error.response?.data
        );
      }
      throw new UmayError(
        ErrorCodes.NETWORK_ERROR,
        error instanceof Error ? error.message : "Unknown network error"
      );
    }
  }

  private processResponse<T>(response: AxiosResponse): T {
    const contentType = response.headers["content-type"] || "";
    const data = response.data;

    // Handle error responses
    if (response.status >= 400) {
      let errorMessage = `HTTP error: ${response.status}`;
      let errorDetails = null;

      try {
        if (data) {
          const text = new TextDecoder().decode(data);
          try {
            const json = JSON.parse(text);
            errorMessage = json.error || errorMessage;
            errorDetails = json.details || null;
          } catch (e) {
            // Not JSON, use as plain text
            errorMessage = text || errorMessage;
          }
        }
      } catch (e) {
        console.error("Error processing error response:", e);
      }

      throw new UmayError(ErrorCodes.API_ERROR, errorMessage, errorDetails);
    }

    // Handle PDF specifically
    if (contentType.includes("application/pdf")) {
      console.log("Processing PDF response", {
        isBuffer: Buffer.isBuffer(data),
        isArrayBuffer: data instanceof ArrayBuffer,
        bytesLength: data?.byteLength || data?.length || 0,
      });

      // Convert to proper Buffer if needed
      if (Buffer.isBuffer(data)) {
        return data as unknown as T;
      } else if (data instanceof ArrayBuffer) {
        const buffer = Buffer.from(data);
        console.log("Converted ArrayBuffer to Buffer:", buffer.length);
        return buffer as unknown as T;
      } else if (data instanceof Uint8Array) {
        const buffer = Buffer.from(data);
        console.log("Converted Uint8Array to Buffer:", buffer.length);
        return buffer as unknown as T;
      } else {
        console.warn("PDF data is in unexpected format:", typeof data);
      }
    }

    // Handle images
    if (contentType.includes("image/")) {
      if (Buffer.isBuffer(data)) {
        return data as unknown as T;
      } else if (data instanceof ArrayBuffer) {
        return Buffer.from(data) as unknown as T;
      } else if (data instanceof Uint8Array) {
        return Buffer.from(data) as unknown as T;
      }
    }

    // Handle JSON
    if (contentType.includes("application/json")) {
      try {
        const text = new TextDecoder().decode(data);
        const jsonData = JSON.parse(text);
        return jsonData as T;
      } catch (e) {
        console.warn(
          "Response has content-type application/json but failed to parse"
        );
      }
    }

    // Default fallback
    console.log("Using default data response handling");
    return data as T;
  }

  private buildHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Accept: "application/json, image/*, application/pdf",
    };
  }

  private normalizeError(error: unknown): UmayError {
    if (error instanceof UmayError) return error;
    if (error instanceof DOMException && error.name === "AbortError") {
      return new UmayError(ErrorCodes.TIMEOUT, "Request timed out");
    }
    return new UmayError(
      ErrorCodes.NETWORK_ERROR,
      error instanceof Error ? error.message : "Unknown network error"
    );
  }
}
