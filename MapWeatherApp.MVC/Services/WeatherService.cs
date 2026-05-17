using MapWeatherApp.MVC.DTOs;

namespace MapWeatherApp.MVC.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<WeatherInfo>> GetAllWeatherAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<List<WeatherInfo>>("https://localhost:7271/api/weather/all");
            if (response == null)
            {
                throw new Exception("Failed to retrieve weather data.");
            }
            return response;
        }
    }
}
