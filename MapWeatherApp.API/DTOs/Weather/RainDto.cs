using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class RainDto
    {
        [JsonPropertyName("1h")]
        public double OneHour { get; set; }
    }
}
