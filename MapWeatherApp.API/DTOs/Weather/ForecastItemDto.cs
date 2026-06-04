using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class ForecastItemDto
    {
        [JsonPropertyName("dt")]
        public long Dt { get; set; }

        [JsonPropertyName("main")]
        public MainDto Main { get; set; }

        [JsonPropertyName("weather")]
        public List<WeatherInfoDto> Weather { get; set; }
    }
}