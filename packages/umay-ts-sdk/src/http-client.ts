// src/http-client.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UmayError } from "./errors";
import { ErrorCodes } from "./errors";
import { UmayConfig } from "./config";

// Yardımcı fonksiyon: Herhangi bir binary veriyi Uint8Array'e dönüştürür
function ensureUint8Array(data: any): Uint8Array {
  if (data instanceof Uint8Array) {
    return data;
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  } else if (
    typeof data === "object" &&
    data !== null &&
    typeof data.byteLength === "number"
  ) {
    // ArrayBuffer-like object
    try {
      return new Uint8Array(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Cannot convert to Uint8Array: ${errorMessage}`);
    }
  }
  throw new Error(
    `Cannot convert to Uint8Array: Unsupported data type ${typeof data}`
  );
}

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
        dataLength: response.data?.length || response.data?.byteLength,
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

    // Handle binary data (PDF or images)
    if (
      contentType.includes("application/pdf") ||
      contentType.includes("image/")
    ) {
      console.log("Processing binary response", {
        isArrayBuffer: data instanceof ArrayBuffer,
        isUint8Array: data instanceof Uint8Array,
        bytesLength: data?.byteLength || data?.length || 0,
      });

      try {
        const uint8Array = ensureUint8Array(data);
        return uint8Array as unknown as T;
      } catch (e) {
        console.warn("Failed to convert binary data:", e);
        return data as unknown as T;
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
