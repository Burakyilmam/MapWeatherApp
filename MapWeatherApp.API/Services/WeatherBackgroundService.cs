using MapWeatherApp.API.Helpers;

namespace MapWeatherApp.API.Services
{
    public class WeatherBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public WeatherBackgroundService(
            IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope =_scopeFactory.CreateScope();

                var weatherService = scope.ServiceProvider.GetRequiredService<WeatherService>();

                var cities = CityDataHelper.GetAllCityNames();

                foreach (var city in cities)
                {
                    try
                    {
                        await weatherService.GetCurrentCityWeatherAsync(city);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{city} hata: {ex.Message}");
                    }
                }

                Console.WriteLine("Tüm şehirler güncellendi");

                await Task.Delay(TimeSpan.FromMinutes(30),stoppingToken);
            }
        }
    }
}