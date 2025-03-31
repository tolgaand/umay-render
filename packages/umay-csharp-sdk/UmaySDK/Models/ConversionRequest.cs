using System.Text.Json.Serialization;

namespace UmaySDK.Models;

public class ConversionRequest
{
    [JsonPropertyName("html")]
    public string? Html { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("outputFormat")]
    public string OutputFormat { get; set; } = "pdf";

    [JsonPropertyName("filename")]
    public string? Filename { get; set; }

    [JsonPropertyName("pageSetupOptions")]
    public PageSetupOptions? PageSetupOptions { get; set; }

    [JsonPropertyName("pdfOptions")]
    public PdfOptions? PdfOptions { get; set; }

    [JsonPropertyName("screenshotOptions")]
    public ScreenshotOptions? ScreenshotOptions { get; set; }
}

public class PageSetupOptions
{
    [JsonPropertyName("viewport")]
    public Viewport? Viewport { get; set; }

    [JsonPropertyName("emulateMediaType")]
    public string? EmulateMediaType { get; set; }

    [JsonPropertyName("waitForSelector")]
    public string? WaitForSelector { get; set; }

    [JsonPropertyName("waitForTimeout")]
    public int? WaitForTimeout { get; set; }

    [JsonPropertyName("waitUntil")]
    public string? WaitUntil { get; set; }

    [JsonPropertyName("cookies")]
    public List<Cookie>? Cookies { get; set; }

    [JsonPropertyName("extraHTTPHeaders")]
    public Dictionary<string, string>? ExtraHTTPHeaders { get; set; }

    [JsonPropertyName("javascriptEnabled")]
    public bool? JavascriptEnabled { get; set; }

    [JsonPropertyName("userAgent")]
    public string? UserAgent { get; set; }

    [JsonPropertyName("evaluateScript")]
    public string? EvaluateScript { get; set; }
}

public class Viewport
{
    [JsonPropertyName("width")]
    public int Width { get; set; }

    [JsonPropertyName("height")]
    public int Height { get; set; }

    [JsonPropertyName("deviceScaleFactor")]
    public double? DeviceScaleFactor { get; set; }

    [JsonPropertyName("isMobile")]
    public bool? IsMobile { get; set; }

    [JsonPropertyName("hasTouch")]
    public bool? HasTouch { get; set; }

    [JsonPropertyName("isLandscape")]
    public bool? IsLandscape { get; set; }
}

public class Cookie
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("domain")]
    public string? Domain { get; set; }

    [JsonPropertyName("path")]
    public string? Path { get; set; }

    [JsonPropertyName("expires")]
    public double? Expires { get; set; }

    [JsonPropertyName("httpOnly")]
    public bool? HttpOnly { get; set; }

    [JsonPropertyName("secure")]
    public bool? Secure { get; set; }

    [JsonPropertyName("sameSite")]
    public string? SameSite { get; set; }
}

public class PdfOptions
{
    [JsonPropertyName("scale")]
    public double? Scale { get; set; }

    [JsonPropertyName("displayHeaderFooter")]
    public bool? DisplayHeaderFooter { get; set; }

    [JsonPropertyName("headerTemplate")]
    public string? HeaderTemplate { get; set; }

    [JsonPropertyName("footerTemplate")]
    public string? FooterTemplate { get; set; }

    [JsonPropertyName("printBackground")]
    public bool? PrintBackground { get; set; }

    [JsonPropertyName("landscape")]
    public bool? Landscape { get; set; }

    [JsonPropertyName("pageRanges")]
    public string? PageRanges { get; set; }

    [JsonPropertyName("format")]
    public string? Format { get; set; }

    [JsonPropertyName("width")]
    public string? Width { get; set; }

    [JsonPropertyName("height")]
    public string? Height { get; set; }

    [JsonPropertyName("margin")]
    public Margin? Margin { get; set; }

    [JsonPropertyName("preferCSSPageSize")]
    public bool? PreferCSSPageSize { get; set; }

    [JsonPropertyName("omitBackground")]
    public bool? OmitBackground { get; set; }

    [JsonPropertyName("tagged")]
    public bool? Tagged { get; set; }

    [JsonPropertyName("timeout")]
    public int? Timeout { get; set; }
}

public class Margin
{
    [JsonPropertyName("top")]
    public string? Top { get; set; }

    [JsonPropertyName("right")]
    public string? Right { get; set; }

    [JsonPropertyName("bottom")]
    public string? Bottom { get; set; }

    [JsonPropertyName("left")]
    public string? Left { get; set; }
}

public class ScreenshotOptions
{
    [JsonPropertyName("quality")]
    public int? Quality { get; set; }

    [JsonPropertyName("fullPage")]
    public bool? FullPage { get; set; }

    [JsonPropertyName("clip")]
    public Clip? Clip { get; set; }

    [JsonPropertyName("omitBackground")]
    public bool? OmitBackground { get; set; }

    [JsonPropertyName("encoding")]
    public string? Encoding { get; set; }

    [JsonPropertyName("captureBeyondViewport")]
    public bool? CaptureBeyondViewport { get; set; }

    [JsonPropertyName("fromSurface")]
    public bool? FromSurface { get; set; }

    [JsonPropertyName("timeout")]
    public int? Timeout { get; set; }
}

public class Clip
{
    [JsonPropertyName("x")]
    public double X { get; set; }

    [JsonPropertyName("y")]
    public double Y { get; set; }

    [JsonPropertyName("width")]
    public double Width { get; set; }

    [JsonPropertyName("height")]
    public double Height { get; set; }
}
