import { GetMap } from "./Map.js";
import { GetColorByTemperature } from "./BorderColor.js";
import { OpenWeatherPanel } from "./WeatherPanel.js";
import { LoadWeatherData, GetWeatherData } from "./Weather.js";

let cityLayer = null;

export function GetCityLayer() {
    return cityLayer;
}

export function mapGeoCityName(name) {

    const cityMap = { "Afyon": "Afyonkarahisar" };

    return cityMap[name] || name;
}

export function GetCityNames() {

    if (!cityLayer) return [];

    const cityNames = [];

    cityLayer.eachLayer(layer => {

        const cityName = layer.feature?.properties?.name;

        if (cityName) {
            cityNames.push(cityName);
        }
    });

    return cityNames;
}

export async function TurkeyGeoJsonDatas() {

    const map = GetMap();

    if (!map) return;

    await LoadWeatherData();

    const weatherData = GetWeatherData();

    const geoResponse = await fetch("https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json");

    const geoData = await geoResponse.json();

    if (cityLayer) {
        map.removeLayer(cityLayer);
    }

    cityLayer = L.geoJSON(geoData, {

        style: () => ({
            color: "#555",
            weight: 1,
            fillOpacity: 0.7
        }),

        onEachFeature: function (feature, layer) {

            const cityName = mapGeoCityName(feature.properties.name);

            const weather = weatherData.find(x => x.city === cityName);

            if (!weather) return;

            layer._weatherData = weather;

            layer.setStyle({
                fillColor: GetColorByTemperature(weather.temperature)
            });

            layer.bindTooltip(
                `
    <div class="modern-weather-tooltip">

        <div class="mwt-city">
            ${weather.city}
        </div>

        <div class="mwt-status">
            ${weather.conditionDescription}
        </div>

        <img 
            class="mwt-icon"
            src="https://openweathermap.org/img/wn/${weather.conditionIcon}@2x.png"
        />

        <div class="mwt-temp">
            ${weather.temperature.toFixed(1)}°
        </div>

        <div class="mwt-feels">
            Hissedilen: ${weather.feelsLike.toFixed(1)}°
        </div>

        <div class="mwt-divider"></div>

        <div class="mwt-grid">

            <div class="mwt-card">
                <div class="mwt-label">💧 Nem</div>
                <div class="mwt-value">%${weather.humidity}</div>
            </div>

            <div class="mwt-card">
                <div class="mwt-label">💨 Rüzgar</div>
                <div class="mwt-value">
                    ${(weather.windSpeed * 3.6).toFixed(0)} km/h
                </div>
            </div>

            <div class="mwt-card">
                <div class="mwt-label">☁️ Bulut</div>
                <div class="mwt-value">%${weather.cloudiness}</div>
            </div>

            <div class="mwt-card">
                <div class="mwt-label">🧭 Basınç</div>
                <div class="mwt-value">${weather.pressure}</div>
            </div>

        </div>

    </div>
    `,
                {
                    sticky: true,
                    direction: "top",
                    opacity: 1,
                    offset: [0, -10],
                    className: "custom-weather-tooltip"
                }
            );

            layer.on("click", function (e) {
                OpenWeatherPanel(weather, e.latlng);
            });
        }

    }).addTo(map);

    if (!window.mapInitialized) {

        map.fitBounds(cityLayer.getBounds());

        window.mapInitialized = true;
    }
}