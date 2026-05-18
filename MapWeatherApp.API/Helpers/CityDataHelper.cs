namespace MapWeatherApp.API.Helpers
{
    public static class CityDataHelper
    {
        private static readonly Dictionary<string, CityInfo> CityData = new()
        {
            { "Adana", new CityInfo { PlateCode = 1 } },
            { "Adıyaman", new CityInfo { PlateCode = 2 } },
            { "Afyonkarahisar", new CityInfo { PlateCode = 3 } },
            { "Ağrı", new CityInfo { PlateCode = 4 } },
            { "Amasya", new CityInfo { PlateCode = 5 } },
            { "Ankara", new CityInfo { PlateCode = 6 } },
            { "Antalya", new CityInfo { PlateCode = 7 } },
            { "Artvin", new CityInfo { PlateCode = 8 } },
            { "Aydın", new CityInfo { PlateCode = 9 } },
            { "Balıkesir", new CityInfo { PlateCode = 10 } },
            { "Bilecik", new CityInfo { PlateCode = 11 } },
            { "Bingöl", new CityInfo { PlateCode = 12 } },
            { "Bitlis", new CityInfo { PlateCode = 13 } },
            { "Bolu", new CityInfo { PlateCode = 14 } },
            { "Burdur", new CityInfo { PlateCode = 15 } },
            { "Bursa", new CityInfo { PlateCode = 16 } },
            { "Çanakkale", new CityInfo { PlateCode = 17 } },
            { "Çankırı", new CityInfo { PlateCode = 18 } },
            { "Çorum", new CityInfo { PlateCode = 19 } },
            { "Denizli", new CityInfo { PlateCode = 20 } },
            { "Diyarbakır", new CityInfo { PlateCode = 21 } },
            { "Edirne", new CityInfo { PlateCode = 22 } },
            { "Elazığ", new CityInfo { PlateCode = 23 } },
            { "Erzincan", new CityInfo { PlateCode = 24 } },
            { "Erzurum", new CityInfo { PlateCode = 25 } },
            { "Eskişehir", new CityInfo { PlateCode = 26 } },
            { "Gaziantep", new CityInfo { PlateCode = 27 } },
            { "Giresun", new CityInfo { PlateCode = 28 } },
            { "Gümüşhane", new CityInfo { PlateCode = 29 } },
            { "Hakkari", new CityInfo { PlateCode = 30 } },
            { "Hatay", new CityInfo { PlateCode = 31 } },
            { "Isparta", new CityInfo { PlateCode = 32 } },
            { "Mersin", new CityInfo { PlateCode = 33 } },
            { "İstanbul", new CityInfo { PlateCode = 34 } },
            { "İzmir", new CityInfo { PlateCode = 35 } },
            { "Kars", new CityInfo { PlateCode = 36 } },
            { "Kastamonu", new CityInfo { PlateCode = 37 } },
            { "Kayseri", new CityInfo { PlateCode = 38 } },
            { "Kırklareli", new CityInfo { PlateCode = 39 } },
            { "Kırşehir", new CityInfo { PlateCode = 40 } },
            { "Kocaeli", new CityInfo { PlateCode = 41 } },
            { "Konya", new CityInfo { PlateCode = 42 } },
            { "Kütahya", new CityInfo { PlateCode = 43 } },
            { "Malatya", new CityInfo { PlateCode = 44 } },
            { "Manisa", new CityInfo { PlateCode = 45 } },
            { "Kahramanmaraş", new CityInfo { PlateCode = 46 } },
            { "Mardin", new CityInfo { PlateCode = 47 } },
            { "Muğla", new CityInfo { PlateCode = 48 } },
            { "Muş", new CityInfo { PlateCode = 49 } },
            { "Nevşehir", new CityInfo { PlateCode = 50 } },
            { "Niğde", new CityInfo { PlateCode = 51 } },
            { "Ordu", new CityInfo { PlateCode = 52 } },
            { "Rize", new CityInfo { PlateCode = 53 } },
            { "Sakarya", new CityInfo { PlateCode = 54 } },
            { "Samsun", new CityInfo { PlateCode = 55 } },
            { "Siirt", new CityInfo { PlateCode = 56 } },
            { "Sinop", new CityInfo { PlateCode = 57 } },
            { "Sivas", new CityInfo { PlateCode = 58 } },
            { "Tekirdağ", new CityInfo { PlateCode = 59 } },
            { "Tokat", new CityInfo { PlateCode = 60 } },
            { "Trabzon", new CityInfo { PlateCode = 61 } },
            { "Tunceli", new CityInfo { PlateCode = 62 } },
            { "Şanlıurfa", new CityInfo { PlateCode = 63 } },
            { "Uşak", new CityInfo { PlateCode = 64 } },
            { "Van", new CityInfo { PlateCode = 65 } },
            { "Yozgat", new CityInfo { PlateCode = 66 } },
            { "Zonguldak", new CityInfo { PlateCode = 67 } },
            { "Aksaray", new CityInfo { PlateCode = 68 } },
            { "Bayburt", new CityInfo { PlateCode = 69 } },
            { "Karaman", new CityInfo { PlateCode = 70 } },
            { "Kırıkkale", new CityInfo { PlateCode = 71 } },
            { "Batman", new CityInfo { PlateCode = 72 } },
            { "Şırnak", new CityInfo { PlateCode = 73 } },
            { "Bartın", new CityInfo { PlateCode = 74 } },
            { "Ardahan", new CityInfo { PlateCode = 75 } },
            { "Iğdır", new CityInfo { PlateCode = 76 } },
            { "Yalova", new CityInfo { PlateCode = 77 } },
            { "Karabük", new CityInfo { PlateCode = 78 } },
            { "Kilis", new CityInfo { PlateCode = 79 } },
            { "Osmaniye", new CityInfo { PlateCode = 80 } },
            { "Düzce", new CityInfo { PlateCode = 81 } }
        };

        public static List<string> GetAllCityNames()
        {
            return CityData.Keys.ToList();
        }

        public static CityInfo? GetCityInfo(string cityName)
        {
            return CityData.TryGetValue(cityName, out var cityInfo) ? cityInfo : null;
        }
    }
}