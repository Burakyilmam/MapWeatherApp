using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class WindDto
    {
        [JsonPropertyName("speed")]
        public double Speed { get; set; }

        [JsonPropertyName("deg")]
        public int Deg { get; set; }
    }
}
