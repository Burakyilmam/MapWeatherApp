
public class City
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int PlateCode { get; set; }

    public string Country { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public ICollection<Weather> Weathers { get; set; }
}