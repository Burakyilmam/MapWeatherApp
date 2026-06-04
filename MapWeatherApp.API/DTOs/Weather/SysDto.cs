using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class SysDto
    {
        [JsonPropertyName("sunrise")]
        public long Sunrise { get; set; }

        [JsonPropertyName("sunset")]
        public long Sunset { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }
    }
}
