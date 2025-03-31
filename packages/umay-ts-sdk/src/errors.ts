export class UmayError extends Error {
  constructor(
    public readonly code: keyof typeof ErrorCodes | string,
    message: string,
    public readonly details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, UmayError.prototype);
    this.name = "UmayError";
  }
}

export const ErrorCodes = {
  SDK_INVALID_INPUT: "SDK_INVALID_INPUT",
  SDK_UNEXPECTED_PROCESSING_ERROR: "SDK_UNEXPECTED_PROCESSING_ERROR",

  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",

  API_ERROR: "API_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  NAVIGATION_ERROR: "NAVIGATION_ERROR",
  SELECTOR_NOT_FOUND: "SELECTOR_NOT_FOUND",
  PAGE_CONTEXT_DESTROYED: "PAGE_CONTEXT_DESTROYED",
  SCRIPT_EVAL_FAILED: "SCRIPT_EVAL_FAILED",
  CONVERSION_ERROR: "CONVERSION_ERROR",
  BROWSER_LAUNCH_FAILED: "BROWSER_LAUNCH_FAILED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
