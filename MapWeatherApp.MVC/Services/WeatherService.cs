using MapWeatherApp.MVC.DTOs;
using System.Text.Json;

namespace MapWeatherApp.MVC.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<WeatherInfoDto>>GetLatestWeatherAsync()
        {
            var response = await _httpClient.GetAsync("api/weather/latest");

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<List<WeatherInfoDto>>(json, options)!;
        }

    }
}
