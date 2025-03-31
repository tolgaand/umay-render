using System.Text;
using System.Text.Json;
using UmaySDK.Models;

namespace UmaySDK;

public class UmayClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public UmayClient(string baseUrl = "http://localhost:3000")
    {
        _baseUrl = baseUrl;
        _httpClient = new HttpClient();
    }

    public async Task<byte[]> RenderAsync(ConversionRequest request)
    {
        // Input validation
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request), "Request cannot be null");
        }

        if (string.IsNullOrEmpty(request.Html) && string.IsNullOrEmpty(request.Url))
        {
            throw new ArgumentException("Either 'html' or 'url' must be provided", nameof(request));
        }

        if (!string.IsNullOrEmpty(request.Html) && !string.IsNullOrEmpty(request.Url))
        {
            throw new ArgumentException(
                "Provide either 'html' or 'url', not both",
                nameof(request)
            );
        }

        if (string.IsNullOrEmpty(request.OutputFormat))
        {
            throw new ArgumentException("Output format is required", nameof(request));
        }

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/v1/render", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new UmayException(
                $"API request failed with status code {response.StatusCode}: {errorContent}"
            );
        }

        return await response.Content.ReadAsByteArrayAsync();
    }

    public async Task SaveToFileAsync(ConversionRequest request, string filePath)
    {
        var bytes = await RenderAsync(request);
        await File.WriteAllBytesAsync(filePath, bytes);
    }
}
