using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class WeatherResponseDto
    {
        [JsonPropertyName("main")]
        public MainDto Main { get; set; }

        [JsonPropertyName("wind")]
        public WindDto Wind { get; set; }

        public RainDto? Rain { get; set; }

        [JsonPropertyName("clouds")]
        public CloudDto Clouds { get; set; }

        [JsonPropertyName("weather")]
        public List<WeatherInfoDto> Weather { get; set; }

        [JsonPropertyName("coord")]
        public CoordinateDto Coordinate { get; set; }

        [JsonPropertyName("visibility")]
        public int Visibility { get; set; }

        [JsonPropertyName("dt")]
        public long Dt { get; set; }
    }
}
