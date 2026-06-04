namespace MapWeatherApp.MVC.DTOs
{
    public class WeatherHistoryDto
    {
        public DateTime Date { get; set; }

        public double AvgTemperature { get; set; }

        public double TempMin { get; set; }

        public double TempMax { get; set; }

        public double Humidity { get; set; }

        public string Icon { get; set; }

        public string Description { get; set; }
    }
}
