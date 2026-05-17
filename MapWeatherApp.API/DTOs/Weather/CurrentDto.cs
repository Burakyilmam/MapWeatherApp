namespace MapWeatherApp.API.DTOs.Weather
{
    public class CurrentDto
    {
        public double Temp_C { get; set; }

        public int Humidity { get; set; }

        public double Wind_Kph { get; set; }

        public double Feelslike_C { get; set; }

        public ConditionDto Condition { get; set; }
    }
}
