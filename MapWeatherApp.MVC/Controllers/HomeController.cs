using System.Diagnostics;
using MapWeatherApp.MVC.Models;
using MapWeatherApp.MVC.Services;
using Microsoft.AspNetCore.Mvc;

namespace MapWeatherApp.MVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly WeatherService _weatherService;

        public HomeController(WeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _weatherService.GetAllWeatherAsync();
            return View(data);
        }
    }
}
