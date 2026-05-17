namespace MapWeatherApp.API.DTOs.Weather
{
    public class ForecastDayDto
    {
        public string Date { get; set; }

        public DayDto Day { get; set; }
    }
}
