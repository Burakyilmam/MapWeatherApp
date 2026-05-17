namespace MapWeatherApp.API.DTOs.Weather
{
    public class DayDto
    {
        public double Maxtemp_C { get; set; }
        public double Mintemp_C { get; set; }
        public double Avgtemp_C { get; set; }
        public int Daily_Chance_Of_Rain { get; set; }
        public ConditionDto Condition { get; set; }
    }
}
