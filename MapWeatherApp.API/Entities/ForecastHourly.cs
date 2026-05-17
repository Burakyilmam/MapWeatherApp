namespace MapWeatherApp.API.Entity
{
    public class ForecastHourly
    {
        public int Id { get; set; }

        public int CityId { get; set; }

        public DateTime Time { get; set; }

        public double Temperature { get; set; }

        public int Humidity { get; set; }

        public double WindSpeed { get; set; }

        public int ChanceOfRain { get; set; }

        public string ConditionIcon { get; set; }
    }
}
