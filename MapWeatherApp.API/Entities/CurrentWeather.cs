namespace MapWeatherApp.API.Entity
{
    public class CurrentWeather
    {
        public int Id { get; set; }

        public int CityId { get; set; }

        public City City { get; set; }

        public double Temperature { get; set; }

        public double FeelsLike { get; set; }

        public int Humidity { get; set; }

        public double WindSpeed { get; set; }

        public double UV { get; set; }

        public string ConditionText { get; set; }

        public string ConditionIcon { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
