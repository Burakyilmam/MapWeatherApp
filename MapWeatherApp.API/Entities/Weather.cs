public class Weather
{
    public int Id { get; set; }

    public int CityId { get; set; }

    public City City { get; set; }

    public double Temperature { get; set; }

    public double FeelsLike { get; set; }

    public double TempMin { get; set; }

    public double TempMax { get; set; }

    public int Humidity { get; set; }

    public int Pressure { get; set; }

    public int Cloudiness { get; set; }

    public int Visibility { get; set; }

    public double WindSpeed { get; set; }

    public int WindDegree { get; set; }

    public double UV { get; set; }

    public string ConditionMain { get; set; }

    public string ConditionDescription { get; set; }

    public string ConditionIcon { get; set; }

    public double RainVolume { get; set; }

    public double SnowVolume { get; set; }

    public DateTime RecordedAt { get; set; }
}