import { GetMap } from "./Map.js";
import { GetColorByTemperature } from "./BorderColor.js";
import { OpenWeatherPanel } from "./WeatherPanel.js";
import { LoadWeatherData, GetWeatherData } from "./Weather.js";
import { StartWeatherEffect, StopWeatherEffect } from "./WeatherEffects.js";

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

            const weatherVideo = GetWeatherVideo(weather.conditionIcon);

            layer._weatherData = weather;

            layer.setStyle({
                fillColor: GetColorByTemperature(weather.temperature)
            });

            layer.bindTooltip(
                `
    <div class="modern-weather-tooltip">

        <video
            class="mwt-background-video"
            src="${weatherVideo}"
            muted
            autoplay
            loop
            playsinline
            preload="auto">
        </video>

        <div class="mwt-overlay"></div>

        <div class="mwt-content">

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
    </div>
    `,
                {
                    sticky: true,
                    direction: "auto",
                    opacity: 1,
                    offset: [15, 15],
                    className: "custom-weather-tooltip"
                }
            );

            layer.on("click", function (e) {
                OpenWeatherPanel(weather, e.latlng);
            });

            layer.on("tooltipopen", function () {
                StartWeatherEffect(weather);
            });

            layer.on("tooltipclose", function () {
                StopWeatherEffect();
            });
        }

    }).addTo(map);

    if (!window.mapInitialized) {

        map.fitBounds(cityLayer.getBounds());

        window.mapInitialized = true;
    }
}

function GetWeatherVideo(icon) {

    const videos = {

        // ☀️ Açık
        "01d": "/videos/clear.mp4",
        "01n": "/videos/clear.mp4",

        // 🌤️ Az bulutlu
        "02d": "/videos/cloudly.mp4",
        "02n": "/videos/cloudly.mp4",

        // ☁️ Bulutlu
        "03d": "/videos/clouds.mp4",
        "03n": "/videos/clouds.mp4",

        // ☁️ Kapalı
        "04d": "/videos/clouds.mp4",
        "04n": "/videos/clouds.mp4",

        // 🌧️ Sağanak
        "09d": "/videos/rain.mp4",
        "09n": "/videos/rain.mp4",

        // 🌧️ Yağmur
        "10d": "/videos/rain.mp4",
        "10n": "/videos/rain.mp4",

        // ⛈️ Fırtına
        "11d": "/videos/thunderstorm.mp4",
        "11n": "/videos/thunderstorm.mp4",

        // ❄️ Kar
        "13d": "/videos/snow.mp4",
        "13n": "/videos/snow.mp4",

        // 🌫️ Sis
        "50d": "/videos/mist.mp4",
        "50n": "/videos/mist.mp4"
    };

    return videos[icon] || "";
}