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
            var latestWeatherIds = await _context.Weathers
                .GroupBy(x => x.CityId)
                .Select(g => g
                    .OrderByDescending(x => x.RecordedAt)
                    .Select(x => x.Id)
                    .First())
                .ToListAsync();

            var data = await _context.Weathers
                .Include(x => x.City)
                .Where(x =>
                    latestWeatherIds.Contains(x.Id) &&
                    x.RecordedAt >= DateTime.Now.AddMinutes(-30))
                .Select(x => new
                {
                    city = x.City.Name,
                    plateCode = x.City.PlateCode,

                    latitude = x.City.Latitude,
                    longitude = x.City.Longitude,

                    temperature = x.Temperature,
                    feelsLike = x.FeelsLike,

                    humidity = x.Humidity,
                    pressure = x.Pressure,

                    windSpeed = x.WindSpeed,
                    windDegree = x.WindDegree,

                    cloudiness = x.Cloudiness,
                    visibility = x.Visibility,

                    conditionMain = x.ConditionMain,
                    conditionDescription = x.ConditionDescription,
                    conditionIcon = x.ConditionIcon,

                    updated = x.RecordedAt
                })
                .OrderBy(x => x.city)
                .ToListAsync();

            return Ok(data);
        }
    }
}
