/// <reference types="jest" />

import { UmaySDK } from "../index";
import { HttpClient } from "../http-client";
import { PdfOptions, ImageOptions } from "../schemas";

// Mock HttpClient
jest.mock("../http-client");

describe("UmaySDK", () => {
  let sdk: UmaySDK;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    sdk = new UmaySDK();
  });

  describe("toPDF", () => {
    it("should call HttpClient with correct parameters", async () => {
      const mockBuffer = Buffer.from("test");
      (HttpClient.prototype.request as jest.Mock).mockResolvedValue(mockBuffer);

      const html = "<html><body>Test</body></html>";
      const options: PdfOptions = {
        format: "A4",
        landscape: false,
      };

      const result = await sdk.toPDF(html, options);

      expect(HttpClient.prototype.request).toHaveBeenCalledWith("/render/pdf", {
        html,
        options: expect.objectContaining(options),
      });
      expect(result).toBe(mockBuffer);
    });

    it("should use default options when none provided", async () => {
      const mockBuffer = Buffer.from("test");
      (HttpClient.prototype.request as jest.Mock).mockResolvedValue(mockBuffer);

      const html = "<html><body>Test</body></html>";

      await sdk.toPDF(html);

      expect(HttpClient.prototype.request).toHaveBeenCalledWith("/render/pdf", {
        html,
        options: expect.any(Object),
      });
    });
  });

  describe("toImage", () => {
    it("should call HttpClient with correct parameters", async () => {
      const mockBuffer = Buffer.from("test");
      (HttpClient.prototype.request as jest.Mock).mockResolvedValue(mockBuffer);

      const html = "<html><body>Test</body></html>";
      const options: ImageOptions = {
        quality: 90,
        fullPage: true,
      };

      const result = await sdk.toImage(html, options);

      expect(HttpClient.prototype.request).toHaveBeenCalledWith(
        "/render/image",
        {
          html,
          options: expect.objectContaining(options),
        }
      );
      expect(result).toBe(mockBuffer);
    });

    it("should use default options when none provided", async () => {
      const mockBuffer = Buffer.from("test");
      (HttpClient.prototype.request as jest.Mock).mockResolvedValue(mockBuffer);

      const html = "<html><body>Test</body></html>";

      await sdk.toImage(html);

      expect(HttpClient.prototype.request).toHaveBeenCalledWith(
        "/render/image",
        {
          html,
          options: expect.any(Object),
        }
      );
    });

    it("should work with viewport option", async () => {
      const mockBuffer = Buffer.from("test");
      (HttpClient.prototype.request as jest.Mock).mockResolvedValue(mockBuffer);

      const html = "<html><body>Test</body></html>";
      const options: ImageOptions = {
        quality: 100,
        fullPage: false,
        viewport: {
          width: 800,
          height: 600,
          deviceScaleFactor: 2,
        },
      };

      await sdk.toImage(html, options);

      expect(HttpClient.prototype.request).toHaveBeenCalledWith(
        "/render/image",
        {
          html,
          options: expect.objectContaining(options),
        }
      );
    });
  });
});
