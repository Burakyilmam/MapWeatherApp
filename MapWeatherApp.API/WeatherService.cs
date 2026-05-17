using MapWeatherApp.API.AppDbContext;
using MapWeatherApp.API.DTOs.Weather;
using MapWeatherApp.API.Entity;
using MapWeatherApp.API.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MapWeatherApp.API
{
    public class WeatherService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;

        public WeatherService(IHttpClientFactory httpClientFactory, IConfiguration configuration, DataContext context)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _context = context;
        }

        public async Task<WeatherResponseDto> GetCurrentWeatherAsync(string city)
        {
            var client = _httpClientFactory.CreateClient("WeatherApi");

            var apiKey = _configuration["WeatherApi:ApiKey"];

            var response = await client.GetAsync($"forecast.json?key={apiKey}&q={city}&days=3&aqi=yes");

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(content);
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var weatherData = JsonSerializer.Deserialize<WeatherResponseDto>(content,options);

            var existingCity = await _context.Cities.FirstOrDefaultAsync(x => x.Name == weatherData.Location.Name);

            City cityEntity;

            if (existingCity == null)
            {
                var cityInfo = CityDataHelper.GetCityInfo(weatherData.Location.Name);

                cityEntity = new City
                {
                    Name = weatherData.Location.Name,
                    PlateCode = cityInfo.PlateCode,
                    Country = weatherData.Location.Country,
                    Latitude = cityInfo.Latitude,
                    Longitude = cityInfo.Longitude
                };

                _context.Cities.Add(cityEntity);

                await _context.SaveChangesAsync();
            }
            else
            {
                cityEntity = existingCity;
            }

            var existingWeather = await _context.CurrentWeathers.FirstOrDefaultAsync(x => x.City.Id == cityEntity.Id);

            if(existingWeather == null)
            {
                var currentWeather = new CurrentWeather
                {
                    City = cityEntity,
                    Temperature = weatherData.Current.Temp_C,
                    FeelsLike = weatherData.Current.Feelslike_C,
                    Humidity = weatherData.Current.Humidity,
                    WindSpeed = weatherData.Current.Wind_Kph,
                    ConditionText = weatherData.Current.Condition.Text,
                    ConditionIcon = weatherData.Current.Condition.Icon,
                    LastUpdated = DateTime.Now
                };

                _context.CurrentWeathers.Add(currentWeather);

                await _context.SaveChangesAsync();
            }
            else
            {
                existingWeather.Temperature = weatherData.Current.Temp_C;
                existingWeather.FeelsLike = weatherData.Current.Feelslike_C;
                existingWeather.Humidity = weatherData.Current.Humidity;
                existingWeather.WindSpeed = weatherData.Current.Wind_Kph;
                existingWeather.ConditionText = weatherData.Current.Condition.Text;
                existingWeather.ConditionIcon = weatherData.Current.Condition.Icon;
                existingWeather.LastUpdated = DateTime.Now;
                _context.CurrentWeathers.Update(existingWeather);
                await _context.SaveChangesAsync();
            }

                return weatherData!;
        }
    }
}
