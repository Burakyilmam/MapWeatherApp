import { GetMap } from "./Map.js";
import { MakeDraggableControl } from "./Draggable.js";
import { StartCitySlider, StopCitySlider } from "./CitySlider.js";
import { StartCityMusic, StopCityMusic } from "./MusicPlayer.js";
import { OpenCityInfoPanel } from "./CityInfoPanel.js";
import { GetWeatherHistory, GetWeatherForecast } from "./WeatherPanelApi.js";
import { GetPressureData, GetSunPosition } from "./WeatherPanelCalculations.js";
import { GetWeatherTip, GetWindDirection, BuildWeatherTimeline } from "./WeatherPanelHelpers.js";
import { BuildWeatherPanelHtml, BuildForecastHtml } from "./WeatherPanelTemplate.js";

const cityDataCache = {};

async function GetCityData(cityName) {

    if (cityDataCache[cityName]) {
        return cityDataCache[cityName];
    }

    const response = await fetch(`/data/${cityName.toLocaleLowerCase("tr-TR")}.json`);

    if (!response.ok) {
        console.error(`${cityName} JSON verisi yüklenemedi.`);
        return null;
    }

    const cityData = await response.json();

    cityDataCache[cityName] = cityData;

    return cityData;
}

window.CloseWeatherPanelGlobal = function () {
    CloseWeatherPanel();
};

window.toggleForecastPanel = function () {

    const content = document.getElementById("forecastContent");
    const arrow = document.getElementById("forecastArrow");

    if (!content) return;

    const isOpen = content.classList.contains("open");

    if (isOpen) {

        content.classList.remove("open");
        arrow.innerHTML = "▼";
    }
    else {

        content.classList.add("open");
        arrow.innerHTML = "▲";
    }
};



export async function OpenWeatherPanel(weather, latlng) {

    const cityData = await GetCityData(weather.city);

    const map = GetMap();

    if (!map) return;

    const panel = document.getElementById("weatherDetailPanel");

    if (!panel) return;

    const point = map.latLngToContainerPoint(latlng);

    panel.style.left = `${point.x - 490}px`;
    panel.style.top = `${point.y - 310}px`;

    const sunriseDate = new Date(weather.sunrise * 1000);
    const sunsetDate = new Date(weather.sunset * 1000);

    const pressure = GetPressureData(weather.pressure);
    const sunPosition = GetSunPosition(weather.sunrise, weather.sunset);

    const windDegree = weather.windDegree || 0;
    const windDirection = GetWindDirection(windDegree);

    const history = await GetWeatherHistory(weather.city);
    const forecast = await GetWeatherForecast(weather.city);

    const timeline = BuildWeatherTimeline(history, forecast, weather);

    const weatherTip = GetWeatherTip(weather);

    const forecastHtml = BuildForecastHtml(timeline);

    panel.innerHTML = BuildWeatherPanelHtml(
        weather,
        cityData,
        weatherTip,
        windDegree,
        windDirection,
        pressure,
        sunPosition,
        sunriseDate,
        sunsetDate,
        forecastHtml
    );

    panel.classList.add("open");

    const infoButton = panel.querySelector(".wp-city-info-btn");

    infoButton?.addEventListener("click", (e) => {

        e.stopPropagation();
        OpenCityInfoPanel(weather.city);

    });

    requestAnimationFrame(() => {

        MakeDraggableControl(panel);
        StartCitySlider(weather.city);
        StartCityMusic(weather.city);
    });
}

export function CloseWeatherPanel() {

    const panel = document.getElementById("weatherDetailPanel");

    if (!panel) return;

    StopCitySlider();
    StopCityMusic();

    panel.classList.remove("open");
}