using MapWeatherApp.API.AppDbContext;
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
            var result = await _weatherService.GetCurrentWeatherAsync(city);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.CurrentWeathers
                .Include(x => x.City)
                .Select(x => new
                {
                    city = x.City.Name,
                    plateCode = x.City.PlateCode,
                    latitude = x.City.Latitude,
                    longitude = x.City.Longitude,
                    temperature = x.Temperature,
                    feelsLike = x.FeelsLike,
                    humidity = x.Humidity,
                    windSpeed = x.WindSpeed,
                    condition = x.ConditionText,
                    icon = x.ConditionIcon,
                    updated = x.LastUpdated
                }).OrderBy(x=>x.city)
                .ToListAsync();

            return Ok(data);
        }
    }
}
