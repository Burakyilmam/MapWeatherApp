using MapWeatherApp.API.AppDbContext;
using MapWeatherApp.API.DTOs.Weather;
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

        public async Task<WeatherResponseDto>
            GetCurrentCityWeatherAsync(string city)
        {
            var client = _httpClientFactory.CreateClient("WeatherApi");

            var apiKey = _configuration["WeatherApi:ApiKey"];

            var cityInfo = CityDataHelper.GetCityInfo(city);

            var encodedCity = Uri.EscapeDataString(city);

            var response = await client.GetAsync(
                $"weather?q={encodedCity}" +
                $"&appid={apiKey}" +
                $"&units=metric" +
                $"&lang=tr");

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(content);
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var weatherData = JsonSerializer.Deserialize<WeatherResponseDto>(content, options);

            var existingCity = await _context.Cities.FirstOrDefaultAsync(x => x.Name == city);

            if (existingCity == null)
            {
                existingCity = new City
                {
                    Name = city,
                    PlateCode = cityInfo.PlateCode,
                    Country = "Turkey",
                    Latitude = weatherData.Coordinate.Lat,
                    Longitude = weatherData.Coordinate.Lon
                };

                _context.Cities.Add(existingCity);

                await _context.SaveChangesAsync();
            }

            var weather = new Weather
            {
                CityId = existingCity.Id,
                Temperature = weatherData.Main.Temp,
                FeelsLike = weatherData.Main.FeelsLike,
                TempMin = weatherData.Main.TempMin,
                TempMax = weatherData.Main.TempMax,
                Humidity = weatherData.Main.Humidity,
                Pressure = weatherData.Main.Pressure,
                Visibility = weatherData.Visibility,
                WindSpeed = weatherData.Wind.Speed,
                WindDegree = weatherData.Wind.Deg,
                ConditionMain = weatherData.Weather[0].Main,
                ConditionDescription = weatherData.Weather[0].Description,
                ConditionIcon = weatherData.Weather[0].Icon,
                Cloudiness = weatherData.Clouds.All,
                RainVolume = weatherData.Rain.OneHour,
                RecordedAt = DateTime.Now
            };

            _context.Weathers.Add(weather);

            await _context.SaveChangesAsync();

            return weatherData!;
        }
    }
}