import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { UmayError, ErrorCodes } from "./errors";
import { UmayConfig } from "./config";

function ensureUint8Array(data: any): Uint8Array {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (
    typeof data === "object" &&
    data !== null &&
    typeof data.byteLength === "number"
  ) {
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
      responseType: "arraybuffer",
      validateStatus: (status) => status < 500,
    });
  }

  async request<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.client.post<ArrayBuffer>(endpoint, data, {});

      return this.processSuccessResponse<T>(response);
    } catch (error: unknown) {
      console.error(`HTTP client error during request to ${endpoint}:`, error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ArrayBuffer>;

        if (
          axiosError.code === "ECONNABORTED" ||
          axiosError.message.includes("timeout")
        ) {
          throw new UmayError(
            ErrorCodes.TIMEOUT,
            `Request timed out after ${this.config.TIMEOUT}ms`,
            axiosError.config
          );
        }

        if (axiosError.response) {
          return this.processErrorResponse<T>(axiosError.response);
        } else if (axiosError.request) {
          throw new UmayError(
            ErrorCodes.NETWORK_ERROR,
            `Network error: No response received from server. ${axiosError.message}`,
            { requestDetails: axiosError.request }
          );
        } else {
          throw new UmayError(
            ErrorCodes.NETWORK_ERROR,
            `Request setup error: ${axiosError.message}`,
            axiosError.config
          );
        }
      }

      throw new UmayError(
        ErrorCodes.NETWORK_ERROR,
        error instanceof Error
          ? error.message
          : "Unknown network or client error",
        error
      );
    }
  }

  private processSuccessResponse<T>(response: AxiosResponse<ArrayBuffer>): T {
    const contentType = response.headers["content-type"]?.toLowerCase() || "";
    const data = response.data;

    if (
      contentType.includes("application/pdf") ||
      contentType.includes("image/")
    ) {
      try {
        const uint8Array = ensureUint8Array(data);
        return uint8Array as unknown as T;
      } catch (e: unknown) {
        console.error("Failed to process binary data:", e);
        throw new UmayError(
          ErrorCodes.API_ERROR,
          "Failed to process binary response from API",
          e
        );
      }
    }

    if (contentType.includes("application/json")) {
      try {
        const text = new TextDecoder().decode(data);
        const jsonData = JSON.parse(text);
        return jsonData as T;
      } catch (e) {
        console.warn(
          "Received JSON content-type but failed to parse response body."
        );
        throw new UmayError(
          ErrorCodes.API_ERROR,
          "Failed to parse JSON response from API",
          { responseText: new TextDecoder().decode(data) }
        );
      }
    }

    console.warn(
      `Unexpected content type received: ${contentType}. Returning raw data.`
    );
    try {
      const uint8Array = ensureUint8Array(data);
      return uint8Array as unknown as T;
    } catch (e) {
      return data as unknown as T;
    }
  }

  private processErrorResponse<T>(response: AxiosResponse<ArrayBuffer>): T {
    const status = response.status;
    let errorCode: keyof typeof ErrorCodes | string = ErrorCodes.API_ERROR;
    let errorMessage = `API request failed with status ${status}`;
    let errorDetails: any = null;
    let publicMessage: string | undefined = undefined;

    try {
      if (response.data && response.data.byteLength > 0) {
        const text = new TextDecoder().decode(response.data);
        try {
          const json = JSON.parse(text);

          if (json.error && typeof json.error === "object") {
            const errObj = json.error;
            const backendCode = errObj.code;
            if (backendCode && typeof backendCode === "string") {
              errorCode = Object.prototype.hasOwnProperty.call(
                ErrorCodes,
                backendCode
              )
                ? (backendCode as keyof typeof ErrorCodes)
                : backendCode;
            }
            publicMessage =
              typeof errObj.message === "string" ? errObj.message : undefined;
            errorMessage =
              typeof errObj.internal_message === "string"
                ? errObj.internal_message
                : publicMessage || errorMessage;
          } else if (typeof json.error === "string") {
            publicMessage = json.error;
            errorMessage = json.error;
          }

          errorDetails = json.details || json.stack || json;
        } catch (parseError) {
          console.warn("API error response was not valid JSON:", text);
          errorMessage = `API Error (${status}): ${text || "No response body"}`;
          publicMessage = `An API error occurred (Status: ${status})`;
          errorDetails = { responseText: text };
        }
      } else {
        errorMessage = `API request failed with status ${status} and empty response body`;
        publicMessage = `An API error occurred (Status: ${status})`;
      }
    } catch (decodeError) {
      console.error("Error processing API error response data:", decodeError);
      errorMessage = `Failed to process error response (Status: ${status})`;
      publicMessage = `An error occurred while processing the API response (Status: ${status})`;
      errorDetails = decodeError;
    }

    throw new UmayError(errorCode, errorMessage, {
      status: status,
      responseDetails: errorDetails,
      publicMessage: publicMessage,
    });
  }
}
