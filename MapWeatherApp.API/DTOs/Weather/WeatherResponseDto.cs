namespace MapWeatherApp.API.DTOs.Weather
{
    public class WeatherResponseDto
    {
        public LocationDto Location { get; set; }

        public CurrentDto Current { get; set; }

        public ForecastDto Forecast { get; set; }
    }
}
