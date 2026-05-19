namespace MapWeatherApp.MVC.DTOs
{
    public class WeatherInfoDto
    {
        public string City { get; set; }

        public int PlateCode { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Temperature { get; set; }

        public double FeelsLike { get; set; }

        public int Humidity { get; set; }

        public int Pressure { get; set; }

        public double WindSpeed { get; set; }

        public int WindDegree { get; set; }

        public int Cloudiness { get; set; }

        public int Visibility { get; set; }

        public double RainVolume { get; set; }

        public double SnowVolume { get; set; }

        public string ConditionMain { get; set; }

        public string ConditionDescription { get; set; }

        public string ConditionIcon { get; set; }

        public DateTime Updated { get; set; }
    }
}
