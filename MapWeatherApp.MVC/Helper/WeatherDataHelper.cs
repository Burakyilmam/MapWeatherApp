namespace MapWeatherApp.MVC.Helper
{
    public class WeatherDataHelper
    {
        private static readonly Dictionary<string, string> WeatherTranslations = new()
        {
            { "sunny", "Güneşli" },
            { "clear", "Açık" },
            { "partly cloudy", "Parçalı bulutlu" },
            { "cloudy", "Bulutlu" },
            { "overcast", "Kapalı" },
            { "mist", "Sisli" },
            { "patchy rain nearby", "Yakınlarda hafif yağmur" },
            { "light rain", "Hafif yağmur" },
            { "moderate rain", "Orta şiddetli yağmur" },
            { "heavy rain", "Şiddetli yağmur" },
            { "thunderstorm", "Gök gürültülü fırtına" },
            { "snow", "Karlı" }
        };

        public static string Translate(string weatherText)
        {
            weatherText = weatherText.Trim().ToLower();

            return WeatherTranslations.TryGetValue(weatherText, out var translated) ? translated : weatherText;
        }
    }
}