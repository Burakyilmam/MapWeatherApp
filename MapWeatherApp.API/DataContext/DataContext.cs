using MapWeatherApp.API.Entity;
using Microsoft.EntityFrameworkCore;

namespace MapWeatherApp.API.AppDbContext
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<City> Cities { get; set; }

        public DbSet<CurrentWeather> CurrentWeathers { get; set; }

        public DbSet<ForecastDaily> ForecastDailies { get; set; }

        public DbSet<ForecastHourly> ForecastHourlies { get; set; }

        public DbSet<WeatherHistory> WeatherHistories { get; set; }
    }
}
