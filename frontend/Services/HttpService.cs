using frontend.Models;

namespace frontend.Services;

public class HttpService(HttpClient client)
{
    private readonly HttpClient _client = client;

    public async Task<List<Legend>> GetLegendsAsync()
    {
        try
        {
            var legends = await _client.GetFromJsonAsync<List<Legend>>("/legends");
            return legends ?? [];
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return [];
        }
    }
}