using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class ForecastResponseDto
    {
        [JsonPropertyName("list")]
        public List<ForecastItemDto> List { get; set; }
    }
}