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

        public async Task<WeatherPanelDto> GetCurrentCityWeatherAsync(string city)
        {
            var client = _httpClientFactory.CreateClient("WeatherApi");

            var apiKey = _configuration["WeatherApi:ApiKey"];

            var cityInfo = CityDataHelper.GetCityInfo(city);

            if (cityInfo == null)
            {
                throw new Exception("Şehir bilgisi bulunamadı.");
            }

            var existingCity = await _context.Cities.FirstOrDefaultAsync(x => x.Name.ToLower() == city.ToLower());

            if (existingCity != null)
            {
                var latestWeather = await _context.Weathers.Where(x => x.CityId == existingCity.Id && x.RecordedAt >= DateTime.Now.AddMinutes(-30)).OrderByDescending(x => x.RecordedAt).FirstOrDefaultAsync();

                if (latestWeather != null)
                {
                    return new WeatherPanelDto
                    {
                        City = existingCity.Name,
                        Country = existingCity.Country,

                        Temperature = latestWeather.Temperature,
                        FeelsLike = latestWeather.FeelsLike,

                        TempMin = latestWeather.TempMin,
                        TempMax = latestWeather.TempMax,

                        Humidity = latestWeather.Humidity,

                        Pressure = latestWeather.Pressure,

                        WindSpeed = latestWeather.WindSpeed,
                        WindDegree = latestWeather.WindDegree,

                        Visibility = latestWeather.Visibility,

                        ConditionDescription = latestWeather.ConditionDescription,
                        ConditionIcon = latestWeather.ConditionIcon,

                        Cloudiness = latestWeather.Cloudiness,

                        RainVolume = latestWeather.RainVolume,
                        SnowVolume = latestWeather.SnowVolume,

                        Sunrise = latestWeather.Sunrise,
                        Sunset = latestWeather.Sunset,

                        UpdatedAt = latestWeather.RecordedAt
                    };
                }
            }

            var encodedCity = Uri.EscapeDataString(city);

            var response = await client.GetAsync($"weather?q={encodedCity},TR" + $"&appid={apiKey}" + $"&units=metric" + $"&lang=tr");

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

            if (weatherData == null)
            {
                throw new Exception("Hava durumu verisi çözümlenemedi.");
            }

            if (weatherData.Weather == null || !weatherData.Weather.Any())
            {
                throw new Exception("Hava durumu detay bilgisi bulunamadı.");
            }

            var currentWeather = weatherData.Weather.FirstOrDefault();

            if (currentWeather == null)
            {
                throw new Exception("Hava durumu detay bilgisi bulunamadı.");
            }


            if (existingCity == null)
            {
                existingCity = new City
                {
                    Name = city,

                    PlateCode = cityInfo.PlateCode,

                    Country = weatherData.Sys?.Country ?? "Türkiye",

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

                ConditionMain = currentWeather.Main,

                ConditionDescription = currentWeather.Description,

                ConditionIcon = currentWeather.Icon,

                Cloudiness = weatherData.Clouds.All,

                RainVolume = weatherData.Rain?.OneHour ?? 0,

                SnowVolume = weatherData.Snow?.OneHour ?? 0,

                Sunrise = weatherData.Sys.Sunrise,

                Sunset = weatherData.Sys.Sunset,

                RecordedAt = DateTime.Now
            };

            _context.Weathers.Add(weather);

            await _context.SaveChangesAsync();

            return new WeatherPanelDto
            {
                City = existingCity.Name,

                Country = existingCity.Country,

                Temperature = weather.Temperature,

                FeelsLike = weather.FeelsLike,

                TempMin = weather.TempMin,

                TempMax = weather.TempMax,

                Humidity = weather.Humidity,

                Pressure = weather.Pressure,

                WindSpeed = weather.WindSpeed,

                WindDegree = weather.WindDegree,

                Visibility = weather.Visibility,

                ConditionDescription = weather.ConditionDescription,

                ConditionIcon = weather.ConditionIcon,

                Cloudiness = weather.Cloudiness,

                RainVolume = weather.RainVolume,

                SnowVolume = weather.SnowVolume,

                Sunrise = weather.Sunrise,

                Sunset = weather.Sunset,

                UpdatedAt = weather.RecordedAt
            };
        }

        public async Task<List<ForecastDayDto>> GetForecastAsync(string city)
        {
            var client = _httpClientFactory.CreateClient("WeatherApi");

            var apiKey = _configuration["WeatherApi:ApiKey"];

            var response = await client.GetAsync($"forecast?q={Uri.EscapeDataString(city)},TR&appid={apiKey}&units=metric&lang=tr");

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(json);
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var forecast = JsonSerializer.Deserialize<ForecastResponseDto>(json, options);

            if (forecast == null)
            {
                return new();
            }

            return forecast.List.GroupBy(x => DateTimeOffset.FromUnixTimeSeconds(x.Dt).Date)
                .Skip(1).Take(5)
                .Select(g =>
                {
                    var weather = g
                .OrderBy(x =>
                    Math.Abs(
                        DateTimeOffset
                            .FromUnixTimeSeconds(x.Dt)
                            .Hour - 12))
                .First();

                 return new ForecastDayDto
                 {
                     Date = g.Key,

                     TempMin = g.Min(x => x.Main.TempMin),

                     TempMax = g.Max(x => x.Main.TempMax),

                     Icon = weather.Weather.First().Icon,

                     Description = weather.Weather.First().Description
                 };
                })
                .ToList();
        }
    }
}