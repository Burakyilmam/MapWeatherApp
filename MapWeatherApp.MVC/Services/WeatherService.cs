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

        public async Task<List<WeatherInfoDto>> GetLatestWeatherAsync()
        {
            var response = await _httpClient.GetAsync("api/weather/latest");

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var data = JsonSerializer.Deserialize<List<WeatherInfoDto>>(json, options);

            return data ?? new List<WeatherInfoDto>();
        }

        public async Task<List<WeatherHistoryDto>> GetHistoryAsync(string city)
        {
            var response = await _httpClient.GetAsync($"api/weather/{city}/history");

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<List<WeatherHistoryDto>>(json, options) ?? new();
        }

        public async Task<List<ForecastDayDto>> GetForecastAsync(string city)
        {
            var response = await _httpClient.GetAsync($"api/weather/{city}/forecast");

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<List<ForecastDayDto>>(json, options) ?? new();
        }
    }
}
