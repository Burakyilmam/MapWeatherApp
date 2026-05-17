namespace MapWeatherApp.API.Entity
{
    public class ForecastDaily
    {
        public int Id { get; set; }

        public int CityId { get; set; }

        public DateTime Date { get; set; }

        public double MinTemp { get; set; }

        public double MaxTemp { get; set; }

        public double AvgTemp { get; set; }

        public int ChanceOfRain { get; set; }

        public string ConditionText { get; set; }

        public string ConditionIcon { get; set; }
    }
}
