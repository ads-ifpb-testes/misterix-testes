namespace frontend.Models;

public class Legend
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public Geometry? Location { get; set; }
    public string PostedBy { get; set; } = string.Empty;
}