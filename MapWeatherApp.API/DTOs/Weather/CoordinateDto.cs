using System.Text.Json.Serialization;

namespace MapWeatherApp.API.DTOs.Weather
{
    public class CoordinateDto
    {
        [JsonPropertyName("lat")]
        public double Lat { get; set; }

        [JsonPropertyName("lon")]
        public double Lon { get; set; }
    }
}
