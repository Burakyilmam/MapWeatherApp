namespace MapWeatherApp.MVC.DTOs
{
    public class WeatherInfo
    {
        public string City { get; set; }

        public int PlateCode { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Temperature { get; set; }

        public double FeelsLike { get; set; }

        public int Humidity { get; set; }

        public double WindSpeed { get; set; }

        public string Condition { get; set; }

        public string Icon { get; set; }

        public DateTime Updated { get; set; }
    }
}
