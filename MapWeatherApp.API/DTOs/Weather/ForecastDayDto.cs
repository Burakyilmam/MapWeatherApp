namespace MapWeatherApp.API.DTOs.Weather
{
    public class ForecastDayDto
    {
        public DateTime Date { get; set; }

        public double TempMin { get; set; }

        public double TempMax { get; set; }

        public string Icon { get; set; }

        public string Description { get; set; }
    }
}