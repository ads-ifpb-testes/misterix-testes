using System.Text.Json.Serialization;

namespace frontend.Models;

public class Legend
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public Geometry Location { get; set; } = new Geometry();
    public string PostedBy { get; set; } = string.Empty;
}