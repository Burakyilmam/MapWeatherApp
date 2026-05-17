namespace MapWeatherApp.API.Entity
{
    public class WeatherHistory
    {
        public int Id { get; set; }

        public int CityId { get; set; }

        public double Temperature { get; set; }

        public int Humidity { get; set; }

        public double WindSpeed { get; set; }

        public DateTime RecordedAt { get; set; }
    }
}
