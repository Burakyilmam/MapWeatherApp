using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class CloudDto
    {
        [JsonPropertyName("all")]
        public int All { get; set; }
    }
}
