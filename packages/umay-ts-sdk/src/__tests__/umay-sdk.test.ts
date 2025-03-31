/// <reference types="jest" />

import { UmaySDK } from "../index";
import { HttpClient } from "../http-client";
import { RenderInput } from "../schemas";
import { UmayError, ErrorCodes } from "../errors";
import { z } from "zod";

jest.mock("../http-client");

let mockHttpClientRequest: jest.Mock;
let consoleErrorSpy: jest.SpyInstance;
let sdk: UmaySDK;

describe("UmaySDK", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHttpClientRequest = HttpClient.prototype.request as jest.Mock;
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    sdk = new UmaySDK({ API_URL: "http://mock-api.com/v1" });
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  describe("render method", () => {
    describe("Successful Render Calls", () => {
      const mockHtml = "<h1>Test HTML</h1>";
      const mockUrl = "https://example.com";
      const mockBuffer = Buffer.from("mock file content");
      beforeEach(() => {
        mockHttpClientRequest.mockResolvedValue(mockBuffer);
      });

      it("should call HttpClient.request with correct endpoint and minimal PDF payload (using html)", async () => {
        const input: RenderInput = { html: mockHtml, outputFormat: "pdf" };
        const expectedPayload = { html: mockHtml, outputFormat: "pdf" };
        const result = await sdk.render(input);
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
        expect(mockHttpClientRequest).toHaveBeenCalledWith(
          "/render",
          expectedPayload
        );
        expect(result).toBe(mockBuffer);
      });

      it("should call HttpClient.request with correct endpoint and minimal PNG payload (using url)", async () => {
        const input: RenderInput = { url: mockUrl, outputFormat: "png" };
        const expectedPayload = { url: mockUrl, outputFormat: "png" };
        const result = await sdk.render(input);
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
        expect(mockHttpClientRequest).toHaveBeenCalledWith(
          "/render",
          expectedPayload
        );
        expect(result).toBe(mockBuffer);
      });

      it("should call HttpClient.request with comprehensive PDF options", async () => {
        const input: RenderInput = {
          html: mockHtml,
          outputFormat: "pdf",
          filename: "custom.pdf",
          pageSetupOptions: {
            emulateMediaType: "print",
            waitForTimeout: 45000,
            cookies: [{ name: "c1", value: "v1" }],
          },
          pdfOptions: {
            format: "Letter",
            landscape: true,
            margin: { top: "5mm", bottom: "5mm" },
            scale: 0.8,
          },
        };

        const expectedPayload = {
          html: mockHtml,
          outputFormat: "pdf",
          filename: "custom.pdf",
          pageSetupOptions: {
            emulateMediaType: "print",
            waitForTimeout: 45000,
            cookies: [{ name: "c1", value: "v1" }],
            waitUntil: "networkidle0",
          },
          pdfOptions: {
            format: "Letter",
            landscape: true,
            margin: {
              top: "5mm",
              bottom: "5mm",
            },
            scale: 0.8,
          },
        };

        await sdk.render(input);
        expect(mockHttpClientRequest).toHaveBeenCalledWith(
          "/render",
          expectedPayload
        );
      });

      it("should call HttpClient.request with comprehensive JPEG options", async () => {
        const input: RenderInput = {
          url: mockUrl,
          outputFormat: "jpeg",
          filename: "screenshot.jpg",
          pageSetupOptions: {
            viewport: { width: 800, height: 600 },
            waitForSelector: "#myElement",
          },
          screenshotOptions: {
            quality: 80,
            fullPage: false,
            clip: { x: 10, y: 10, width: 100, height: 100 },
          },
        };

        const expectedPayload = {
          url: mockUrl,
          outputFormat: "jpeg",
          filename: "screenshot.jpg",
          pageSetupOptions: {
            viewport: { width: 800, height: 600 },
            waitForSelector: "#myElement",
            waitForTimeout: 30000,
            waitUntil: "networkidle0",
          },
          screenshotOptions: {
            quality: 80,
            fullPage: false,
            clip: { x: 10, y: 10, width: 100, height: 100 },
          },
        };

        await sdk.render(input);
        expect(mockHttpClientRequest).toHaveBeenCalledWith(
          "/render",
          expectedPayload
        );
      });
    });

    describe("Input Validation Errors (SDK Level)", () => {
      it("should throw UmayError with SDK_INVALID_INPUT if both html and url are missing", async () => {
        const input: any = { outputFormat: "pdf" };
        await expect(sdk.render(input as RenderInput)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining(
            "Either 'html' or 'url' must be provided"
          ),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });

      it("should throw UmayError with SDK_INVALID_INPUT if both html and url are provided", async () => {
        const input: any = {
          html: "h",
          url: "https://valid.url",
          outputFormat: "pdf",
        };
        await expect(sdk.render(input as RenderInput)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining(
            "Provide either 'html' or 'url', not both"
          ),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });

      it("should throw UmayError with SDK_INVALID_INPUT if outputFormat is missing", async () => {
        const input: any = { html: "<h1>Hi</h1>" };
        await expect(sdk.render(input as RenderInput)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining("outputFormat: Required"),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });

      it("should throw UmayError with SDK_INVALID_INPUT for invalid outputFormat", async () => {
        const input: any = { html: "h", outputFormat: "gif" };
        await expect(sdk.render(input as RenderInput)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining("outputFormat: Invalid enum value"),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });

      it("should throw UmayError with SDK_INVALID_INPUT for invalid nested option (e.g., negative quality)", async () => {
        const input: RenderInput = {
          html: "h",
          outputFormat: "jpeg",
          screenshotOptions: { quality: -10 },
        };
        await expect(sdk.render(input)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining(
            "screenshotOptions.quality: Number must be greater than or equal to 0"
          ),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });

      it("should throw UmayError with SDK_INVALID_INPUT for invalid option combination (quality for png)", async () => {
        const input: RenderInput = {
          html: "h",
          outputFormat: "png",
          screenshotOptions: { quality: 90 },
        };
        await expect(sdk.render(input)).rejects.toMatchObject({
          code: ErrorCodes.SDK_INVALID_INPUT,
          message: expect.stringContaining(
            "'quality' option is not applicable for 'png'"
          ),
        });
        expect(mockHttpClientRequest).not.toHaveBeenCalled();
      });
    });

    describe("API/HttpClient Error Propagation", () => {
      const validInput: RenderInput = {
        html: "<h1>OK</h1>",
        outputFormat: "pdf",
      };

      it("should propagate API_ERROR from HttpClient", async () => {
        const apiError = new UmayError(
          ErrorCodes.API_ERROR,
          "Backend API failed",
          { status: 500 }
        );
        mockHttpClientRequest.mockRejectedValue(apiError);
        await expect(sdk.render(validInput)).rejects.toEqual(apiError);
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
      });

      it("should propagate NAVIGATION_ERROR from HttpClient", async () => {
        const navError = new UmayError(
          ErrorCodes.NAVIGATION_ERROR,
          "Failed to navigate",
          { status: 400 }
        );
        mockHttpClientRequest.mockRejectedValue(navError);
        await expect(sdk.render(validInput)).rejects.toMatchObject({
          code: ErrorCodes.NAVIGATION_ERROR,
        });
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
      });

      it("should propagate TIMEOUT error from HttpClient", async () => {
        const timeoutError = new UmayError(
          ErrorCodes.TIMEOUT,
          "Request timed out"
        );
        mockHttpClientRequest.mockRejectedValue(timeoutError);
        await expect(sdk.render(validInput)).rejects.toMatchObject({
          code: ErrorCodes.TIMEOUT,
        });
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
      });

      it("should propagate UNEXPECTED errors from HttpClient as specific UmayError", async () => {
        const genericError = new Error("Something weird happened");
        const wrappedError = new UmayError(
          ErrorCodes.NETWORK_ERROR,
          genericError.message,
          genericError
        );
        mockHttpClientRequest.mockRejectedValue(wrappedError);
        await expect(sdk.render(validInput)).rejects.toMatchObject({
          code: ErrorCodes.NETWORK_ERROR,
        });
        expect(mockHttpClientRequest).toHaveBeenCalledTimes(1);
      });
    });
  });
});
