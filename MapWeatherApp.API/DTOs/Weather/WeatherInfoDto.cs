using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class WeatherInfoDto
    {
        [JsonPropertyName("main")]
        public string Main { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("icon")]
        public string Icon { get; set; }
    }
}
