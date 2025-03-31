using System.Net;
using System.Text;
using System.Text.Json;
using Moq;
using Moq.Protected;
using UmaySDK;
using UmaySDK.Models;
using Xunit;

namespace UmaySDK.Tests;

public class UmayClientTests
{
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly HttpClient _httpClient;
    private readonly UmayClient _client;

    public UmayClientTests()
    {
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHttpMessageHandler.Object)
        {
            BaseAddress = new Uri("http://mock-api.com")
        };

        // Use reflection to set the private HttpClient in UmayClient
        var client = new UmayClient("http://mock-api.com");
        var httpClientField = typeof(UmayClient).GetField(
            "_httpClient",
            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance
        );
        httpClientField?.SetValue(client, _httpClient);

        _client = client;
    }

    [Fact]
    public async Task RenderAsync_WithHtmlToPdf_CallsApiWithCorrectEndpointAndPayload()
    {
        // Arrange
        var mockHtml = "<h1>Test HTML</h1>";
        var request = new ConversionRequest { Html = mockHtml, OutputFormat = "pdf" };

        var mockResponseContent = new byte[] { 1, 2, 3, 4 }; // Mock PDF content

        HttpRequestMessage capturedRequest = null;

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(
                new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new ByteArrayContent(mockResponseContent)
                }
            )
            .Callback<HttpRequestMessage, CancellationToken>(
                (req, _) =>
                {
                    capturedRequest = req;
                    // We'll verify in the Assert part
                }
            );

        // Act
        var result = await _client.RenderAsync(request);

        // Assert
        Assert.Equal(mockResponseContent, result);
        Assert.NotNull(capturedRequest);
        Assert.Equal(HttpMethod.Post, capturedRequest.Method);
        Assert.Equal("http://mock-api.com/v1/render", capturedRequest.RequestUri?.ToString());
        Assert.Equal("application/json", capturedRequest.Content?.Headers.ContentType?.MediaType);

        _mockHttpMessageHandler
            .Protected()
            .Verify(
                "SendAsync",
                Times.Once(),
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.Method == HttpMethod.Post
                    && req.RequestUri != null
                    && req.RequestUri.ToString() == "http://mock-api.com/v1/render"
                ),
                ItExpr.IsAny<CancellationToken>()
            );
    }

    [Fact]
    public async Task RenderAsync_WithUrlToPng_CallsApiWithCorrectEndpointAndPayload()
    {
        // Arrange
        var mockUrl = "https://example.com";
        var request = new ConversionRequest { Url = mockUrl, OutputFormat = "png" };

        var mockResponseContent = new byte[] { 1, 2, 3, 4 }; // Mock PNG content

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(
                new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new ByteArrayContent(mockResponseContent)
                }
            );

        // Act
        var result = await _client.RenderAsync(request);

        // Assert
        Assert.Equal(mockResponseContent, result);
        _mockHttpMessageHandler
            .Protected()
            .Verify(
                "SendAsync",
                Times.Once(),
                ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Post),
                ItExpr.IsAny<CancellationToken>()
            );
    }

    [Fact]
    public async Task RenderAsync_WithComprehensivePdfOptions_CallsApiWithAllOptions()
    {
        // Arrange
        var mockHtml = "<h1>Test HTML</h1>";
        var request = new ConversionRequest
        {
            Html = mockHtml,
            OutputFormat = "pdf",
            Filename = "custom.pdf",
            PageSetupOptions = new PageSetupOptions
            {
                EmulateMediaType = "print",
                WaitForTimeout = 45000,
                Cookies = new List<UmaySDK.Models.Cookie>
                {
                    new UmaySDK.Models.Cookie { Name = "c1", Value = "v1" }
                }
            },
            PdfOptions = new PdfOptions
            {
                Format = "Letter",
                Landscape = true,
                Margin = new Margin { Top = "5mm", Bottom = "5mm" },
                Scale = 0.8
            }
        };

        var mockResponseContent = new byte[] { 1, 2, 3, 4 }; // Mock PDF content

        string capturedContent = null;

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(
                new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new ByteArrayContent(mockResponseContent)
                }
            )
            .Callback<HttpRequestMessage, CancellationToken>(
                async (req, _) =>
                {
                    if (req.Content != null)
                    {
                        capturedContent = await req.Content.ReadAsStringAsync();
                    }
                }
            );

        // Act
        var result = await _client.RenderAsync(request);

        // Assert
        Assert.Equal(mockResponseContent, result);
        Assert.NotNull(capturedContent);

        // Verify JSON contains expected properties
        Assert.Contains("\"html\"", capturedContent);
        Assert.Contains("\"outputFormat\":\"pdf\"", capturedContent);
        Assert.Contains("\"filename\":\"custom.pdf\"", capturedContent);
        Assert.Contains("\"emulateMediaType\":\"print\"", capturedContent);
        Assert.Contains("\"waitForTimeout\":45000", capturedContent);
        Assert.Contains("\"name\":\"c1\"", capturedContent);
        Assert.Contains("\"value\":\"v1\"", capturedContent);
        Assert.Contains("\"format\":\"Letter\"", capturedContent);
        Assert.Contains("\"landscape\":true", capturedContent);
        Assert.Contains("\"top\":\"5mm\"", capturedContent);
        Assert.Contains("\"bottom\":\"5mm\"", capturedContent);
        Assert.Contains("\"scale\":0.8", capturedContent);
    }

    [Fact]
    public async Task RenderAsync_WithComprehensiveJpegOptions_CallsApiWithAllOptions()
    {
        // Arrange
        var mockUrl = "https://example.com";
        var request = new ConversionRequest
        {
            Url = mockUrl,
            OutputFormat = "jpeg",
            Filename = "screenshot.jpg",
            PageSetupOptions = new PageSetupOptions
            {
                Viewport = new Viewport { Width = 800, Height = 600 },
                WaitForSelector = "#myElement"
            },
            ScreenshotOptions = new ScreenshotOptions
            {
                Quality = 80,
                FullPage = false,
                Clip = new Clip
                {
                    X = 10,
                    Y = 10,
                    Width = 100,
                    Height = 100
                }
            }
        };

        var mockResponseContent = new byte[] { 1, 2, 3, 4 }; // Mock JPEG content

        string capturedContent = null;

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(
                new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new ByteArrayContent(mockResponseContent)
                }
            )
            .Callback<HttpRequestMessage, CancellationToken>(
                async (req, _) =>
                {
                    if (req.Content != null)
                    {
                        capturedContent = await req.Content.ReadAsStringAsync();
                    }
                }
            );

        // Act
        var result = await _client.RenderAsync(request);

        // Assert
        Assert.Equal(mockResponseContent, result);
        Assert.NotNull(capturedContent);

        // Verify JSON contains expected properties
        Assert.Contains("\"url\"", capturedContent);
        Assert.Contains("\"outputFormat\":\"jpeg\"", capturedContent);
        Assert.Contains("\"filename\":\"screenshot.jpg\"", capturedContent);
        Assert.Contains("\"width\":800", capturedContent);
        Assert.Contains("\"height\":600", capturedContent);
        Assert.Contains("\"waitForSelector\":\"#myElement\"", capturedContent);
        Assert.Contains("\"quality\":80", capturedContent);
        Assert.Contains("\"fullPage\":false", capturedContent);
        Assert.Contains("\"x\":10", capturedContent);
        Assert.Contains("\"y\":10", capturedContent);
        Assert.Contains("\"width\":100", capturedContent);
        Assert.Contains("\"height\":100", capturedContent);
    }

    [Fact]
    public async Task RenderAsync_WithApiError_ThrowsUmayException()
    {
        // Arrange
        var request = new ConversionRequest { Html = "<h1>Test</h1>", OutputFormat = "pdf" };

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(
                new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Content = new StringContent("Server error")
                }
            );

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UmayException>(() => _client.RenderAsync(request));
        Assert.Contains("API request failed with status code", exception.Message);
        Assert.Contains("Server error", exception.Message);
    }

    [Fact]
    public async Task SaveToFileAsync_WritesContentToFile()
    {
        // Arrange
        var mockHtml = "<h1>Test HTML</h1>";
        var request = new ConversionRequest { Html = mockHtml, OutputFormat = "pdf" };

        var mockResponseContent = new byte[] { 1, 2, 3, 4 }; // Mock PDF content
        var tempFilePath = Path.GetTempFileName();

        try
        {
            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(
                    new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.OK,
                        Content = new ByteArrayContent(mockResponseContent)
                    }
                );

            // Act
            await _client.SaveToFileAsync(request, tempFilePath);

            // Assert
            Assert.True(File.Exists(tempFilePath));
            var fileContent = await File.ReadAllBytesAsync(tempFilePath);
            Assert.Equal(mockResponseContent, fileContent);
        }
        finally
        {
            // Cleanup
            if (File.Exists(tempFilePath))
            {
                File.Delete(tempFilePath);
            }
        }
    }

    [Fact]
    public async Task RenderAsync_WhenBothHtmlAndUrlAreNull_ThrowsArgumentException()
    {
        // Arrange
        var request = new ConversionRequest { OutputFormat = "pdf" };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _client.RenderAsync(request));
    }

    [Fact]
    public async Task RenderAsync_WhenBothHtmlAndUrlAreProvided_ThrowsArgumentException()
    {
        // Arrange
        var request = new ConversionRequest
        {
            Html = "<h1>Test</h1>",
            Url = "https://example.com",
            OutputFormat = "pdf"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _client.RenderAsync(request));
    }
}
