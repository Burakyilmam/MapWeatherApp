using Microsoft.EntityFrameworkCore;

namespace MapWeatherApp.API.AppDbContext
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<City> Cities { get; set; }

        public DbSet<Weather> Weathers { get; set; }
    }
}
