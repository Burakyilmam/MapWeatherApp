using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class SnowDto
    {
        [JsonPropertyName("1h")]
        public double OneHour { get; set; }
    }
}
