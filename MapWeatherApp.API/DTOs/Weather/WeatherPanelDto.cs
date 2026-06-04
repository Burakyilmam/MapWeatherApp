namespace MapWeatherApp.API.DTOs.Weather
{
    public class WeatherPanelDto
    {
        public string City { get; set; }
        public string Country { get; set; }

        public double Temperature { get; set; }

        public double FeelsLike { get; set; }

        public double TempMin { get; set; }

        public double TempMax { get; set; }

        public int Humidity { get; set; }

        public int Pressure { get; set; }

        public double WindSpeed { get; set; }

        public int WindDegree { get; set; }

        public int Visibility { get; set; }

        public string ConditionDescription { get; set; }

        public string ConditionIcon { get; set; }

        public int Cloudiness { get; set; }

        public double RainVolume { get; set; }

        public double SnowVolume { get; set; }

        public long Sunrise { get; set; }

        public long Sunset { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
