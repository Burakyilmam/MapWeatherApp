using MapWeatherApp.API.AppDbContext;
using MapWeatherApp.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MapWeatherApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly WeatherService _weatherService;
        private readonly DataContext _context;

        public WeatherController(WeatherService weatherService, DataContext context)
        {
            _weatherService = weatherService;
            _context = context;
        }

        [HttpGet("{city}")]
        public async Task<IActionResult> Get(string city)
        {
            var result = await _weatherService.GetCurrentCityWeatherAsync(city);
            return Ok(result);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestWeather()
        {
            var todayRanges = await _context.Weathers
                .Where(x =>
                    x.RecordedAt >= DateTime.Today &&
                    x.RecordedAt < DateTime.Today.AddDays(1))
                .GroupBy(x => x.CityId)
                .Select(g => new
                {
                    CityId = g.Key,
                    TempMin = g.Min(x => x.Temperature),
                    TempMax = g.Max(x => x.Temperature)
                })
                .ToDictionaryAsync(x => x.CityId);

            var latestWeatherIds = await _context.Weathers
                .GroupBy(x => x.CityId)
                .Select(g => g
                    .OrderByDescending(x => x.RecordedAt)
                    .Select(x => x.Id)
                    .First())
                .ToListAsync();

            var data = await _context.Weathers
                .Include(x => x.City)
                .Where(x => latestWeatherIds.Contains(x.Id))
                .OrderBy(x => x.City.Name)
                .ToListAsync();

            var result = data.Select(x => new
            {
                city = x.City.Name,
                country = x.City.Country,

                plateCode = x.City.PlateCode,

                latitude = x.City.Latitude,
                longitude = x.City.Longitude,

                temperature = x.Temperature,
                feelsLike = x.FeelsLike,

                tempMin = todayRanges.ContainsKey(x.CityId) ? todayRanges[x.CityId].TempMin : x.TempMin,
                tempMax = todayRanges.ContainsKey(x.CityId) ? todayRanges[x.CityId].TempMax : x.TempMax,

                humidity = x.Humidity,
                pressure = x.Pressure,

                windSpeed = x.WindSpeed,
                windDegree = x.WindDegree,

                rainVolume = x.RainVolume,
                snowVolume = x.SnowVolume,

                sunrise = x.Sunrise,
                sunset = x.Sunset,

                cloudiness = x.Cloudiness,
                visibility = x.Visibility,

                conditionMain = x.ConditionMain,
                conditionDescription = x.ConditionDescription,
                conditionIcon = x.ConditionIcon,

                updated = x.RecordedAt
            });

            return Ok(result);
        }

        [HttpGet("{city}/history")]
        public async Task<IActionResult> GetHistoryWeather(string city)
        {
            var cityEntity = await _context.Cities.FirstOrDefaultAsync(x => x.Name == city);

            if (cityEntity == null)
            {
                return NotFound("Şehir bulunamadı.");
            }

            var startDate = DateTime.Today.AddDays(-5);

            var endDate = DateTime.Today;

            var historyData = await _context.Weathers
                .Where(x =>
                    x.CityId == cityEntity.Id &&
                    x.RecordedAt >= startDate &&
                    x.RecordedAt < endDate)
                .GroupBy(x => x.RecordedAt.Date)
                .Select(g => new
                {
                    date = g.Key,

                    avgTemperature = g.Average(x => x.Temperature),

                    tempMin = g.Min(x => x.Temperature),

                    tempMax = g.Max(x => x.Temperature),

                    humidity = g.Average(x => x.Humidity),

                    icon = g
                        .OrderByDescending(x => x.RecordedAt)
                        .Select(x => x.ConditionIcon)
                        .FirstOrDefault(),

                    description = g
                        .OrderByDescending(x => x.RecordedAt)
                        .Select(x => x.ConditionDescription)
                        .FirstOrDefault()
                })
                .ToListAsync();


            var result = new List<object>();

            for (int i = 5; i >= 1; i--)
            {
                var date = DateTime.Today.AddDays(-i);
                var dayData = historyData.FirstOrDefault(x => x.date == date);

                if (dayData != null)
                {
                    result.Add(new
                    {
                        date = date,
                        avgTemperature = dayData.avgTemperature,
                        tempMin = dayData.tempMin,
                        tempMax = dayData.tempMax,
                        humidity = dayData.humidity,
                        icon = dayData.icon,
                        description = dayData.description,
                        hasData = true
                    });
                }
                else
                {
                    result.Add(new
                    {
                        date = date,
                        avgTemperature = (double?)null,
                        tempMin = (double?)null,
                        tempMax = (double?)null,
                        humidity = (double?)null,
                        icon = (string?)null,
                        description = "Veri yok",
                        hasData = false
                    });
                }
            }

            return Ok(result);
        }

        [HttpGet("{city}/forecast")]
        public async Task<IActionResult> GetForecast(string city)
        {
            var result = await _weatherService.GetForecastAsync(city);

            return Ok(result);
        }
    }
}
