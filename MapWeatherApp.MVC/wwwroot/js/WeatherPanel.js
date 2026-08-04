import { GetMap } from "./Map.js";
import { MakeDraggableControl } from "./Draggable.js";
import { cities } from "./Cities.js";
import { StartCitySlider, StopCitySlider } from "./CitySlider.js";
import { StartCityMusic, StopCityMusic } from "./MusicPlayer.js";

window.CloseWeatherPanelGlobal = function () {
    CloseWeatherPanel();
};

window.toggleForecastPanel = function () {

    const content =
        document.getElementById("forecastContent");

    const arrow =
        document.getElementById("forecastArrow");

    if (!content)
        return;

    const isOpen =
        content.classList.contains("open");

    if (isOpen) {

        content.classList.remove("open");

        arrow.innerHTML = "▼";
    }
    else {

        content.classList.add("open");

        arrow.innerHTML = "▲";
    }
};

function getWeatherTip(weather) {

    const temp = weather.temperature;

    if ((weather.rainVolume || 0) > 0)
        return "Şemsiye almayı unutmayın";

    if (weather.windSpeed * 3.6 >= 45)
        return "Şiddetli rüzgara karşı dikkatli olun";

    if (weather.visibility <= 2000)
        return "Görüş mesafesi çok düşük";

    if (weather.humidity >= 85)
        return "Yüksek nem bunaltıcı olabilir";

    if (weather.cloudiness >= 85)
        return "Gökyüzü tamamen kapalı";

    if (temp >= 40)
        return "Aşırı sıcaklara dikkat";

    if (temp >= 30)
        return "Güneş kremi kullanmalısınız";

    if (temp >= 25)
        return "Güzel bir gün sizi bekliyor";

    if (temp >= 20)
        return "Hava oldukça keyifli";

    if (temp >= 15)
        return "Hafif bir hırka yeterli olur";

    if (temp >= 10)
        return "İnce bir ceket alabilirsiniz";

    if (temp >= 5)
        return "Hava serin, mont önerilir";

    if (temp >= 0)
        return "Hava soğuk, sıkı giyinin";

    if (temp >= -10)
        return "Don tehlikesine dikkat";

    return "Buzlanmaya dikkat ediniz";
}

function getWindDirection(deg) {

    if (deg >= 337.5 || deg < 22.5) return "K";
    if (deg < 67.5) return "KD";
    if (deg < 112.5) return "D";
    if (deg < 157.5) return "GD";
    if (deg < 202.5) return "G";
    if (deg < 247.5) return "GB";
    if (deg < 292.5) return "B";

    return "KB";
}

export async function OpenWeatherPanel(weather, latlng) {

    const map = GetMap();

    if (!map) return;

    const panel = document.getElementById("weatherDetailPanel");

    if (!panel) return;

    const point = map.latLngToContainerPoint(latlng);

    panel.style.left = `${point.x - 490}px`;
    panel.style.top = `${point.y - 310}px`;

    const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    const today = new Date();

    const sunriseDate = new Date(weather.sunrise * 1000);
    const sunsetDate = new Date(weather.sunset * 1000);

    const sunriseMin = sunriseDate.getHours() * 60 + sunriseDate.getMinutes();

    const sunsetMin = sunsetDate.getHours() * 60 + sunsetDate.getMinutes();

    const currentHour = new Date().getHours();

    const currentMin = new Date().getMinutes();

    const totalMinutes = (currentHour * 60) + currentMin;

    let sunX = 5;
    let sunY = 32;

    if (totalMinutes >= sunriseMin && totalMinutes <= sunsetMin) {

        const pct = (totalMinutes - sunriseMin) / (sunsetMin - sunriseMin);

        sunX = 5 + (90 * pct);
        sunY = 32 - (60 * pct * (1 - pct));
    }
    else if (totalMinutes > sunsetMin) {
        sunX = 95;
        sunY = 32;
    }

    const pressureValue = weather.pressure || 1012;
    const minP = 960;
    const maxP = 1060;
    const pPercentage = Math.max(0, Math.min(1, (pressureValue - minP) / (maxP - minP)));
    const speedoRotation = -90 + (pPercentage * 180);

    let pressureStatus = "Normal";
    let pressureStatusClass = "normal";

    if (pressureValue < 1000) {
        pressureStatus = "Düşük";
        pressureStatusClass = "low";
    }

    if (pressureValue > 1020) {
        pressureStatus = "Yüksek";
        pressureStatusClass = "high";
    }

    const windDegree = weather.windDegree || 0;
    const windDirection = getWindDirection(windDegree);

    const historyResponse = await fetch(`https://localhost:7271/api/Weather/${weather.city}/history`);

    const history = await historyResponse.json();

    const forecastResponse = await fetch(`https://localhost:7271/api/Weather/${weather.city}/forecast`);

    const forecast = await forecastResponse.json();

    let forecastHtml = "";

    const timeline = [];

    history.reverse().forEach(day => {

        timeline.push({
            date: day.date,
            icon: day.icon,
            tempMin: day.tempMin,
            tempMax: day.tempMax,
            humidity: day.humidity,
            type: "history"
        });

    });

    timeline.push({
        date: new Date(),
        icon: weather.conditionIcon,
        tempMin: weather.tempMin,
        tempMax: weather.tempMax,
        humidity: weather.humidity,
        type: "today"
    });

    forecast.forEach(day => {

        timeline.push({
            date: day.date,
            icon: day.icon,
            tempMin: day.tempMin,
            tempMax: day.tempMax,
            humidity: 0,
            type: "forecast"
        });

    });

    timeline.forEach(day => {

        const date = new Date(day.date);

        const dayName =
            day.type === "today"
                ? "Bugün"
                : daysOfWeek[date.getDay()];

        const dayString = date.toLocaleDateString(
            "tr-TR",
            {
                day: "numeric",
                month: "short"
            });

        forecastHtml += `
        <div class="weather-forecast-day ${day.type === "today" ? "today" : ""}">

            <div class="weather-forecast-name">
                ${dayName}
            </div>

            <div class="weather-forecast-date">
                ${dayString}
            </div>

            <img
                class="weather-forecast-icon"
                src="https://openweathermap.org/img/wn/${day.icon}@2x.png"
            />

            <div class="weather-forecast-temp">
                ${Math.round(day.tempMax)}°
            </div>

            <div class="weather-forecast-min">
                ${Math.round(day.tempMin)}°
            </div>

        </div>
    `;
    });

    let weatherTip = getWeatherTip(weather);

    panel.innerHTML = `
        <div class="weather-dashboard">

            <button
                id="closeWeatherPanel"
                class="weather-close-btn"
                onclick="window.CloseWeatherPanelGlobal()">

                ✕

            </button>

            <div class="weather-main-grid">

                <div class="wp-left-card">

            <div class="wp-city-music-controls">

                <button
                     type="button"
                     class="wp-city-info-btn"
                     title="Şehir bilgileri">
                     ⓘ
                </button>

                <div class="wp-city-music-progress">
                    <div class="wp-city-music-progress-fill"></div>
                </div>
            
                <button
                    type="button"
                    class="wp-city-music-mute"
                    title="Sesi kapat">
                    🔊
                </button>
            
            </div>

              <div class="wp-header">
                <a
                    class="wp-city-name"
                    href="${cities[weather.city]?.wiki || "#"}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="${weather.city} hakkında bilgi">

                    ${weather.city}

                </a>
            </div>

                    <div class="wp-center-info">

                        <img
                            class="wp-big-icon"
                            src="https://openweathermap.org/img/wn/${weather.conditionIcon}@4x.png"
                        />

                        <div class="wp-condition-desc">
                            ${weather.conditionDescription}
                        </div>

                        <div class="wp-main-temp">
                            ${weather.temperature.toFixed(0)}
                            <span class="wp-celsius">°C</span>
                        </div>

                        <div class="wp-feels-like">
                            Hissedilen:
                            ${weather.feelsLike.toFixed(0)}°C
                        </div>

                    </div>

                    <a
                        class="wp-city-image-title"
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer">
                    </a>

                <div class="wp-city-slider-dots"></div>
                
                <div class="wp-footer-action">
                    <div class="wp-weather-tip">
                        <span>${weatherTip}</span>
                    </div>
                </div>
                
                <button
                    class="wp-city-slider-arrow wp-city-slider-prev"
                    type="button">
                    ‹
                </button>
                
                <button
                    class="wp-city-slider-arrow wp-city-slider-next"
                    type="button">
                    ›
                </button>

                </div>

                <div class="wp-middle-column">

                    <div class="wp-temp-range-card">

                        <div class="wp-temp-range-text">

                            <div class="wp-extreme-val">
                                <span>❄️ En Düşük</span>
                                <b>${weather.tempMin.toFixed(0)}°</b>
                            </div>

                            <div class="wp-extreme-val">
                                <span>🔥 En Yüksek</span>
                                <b>${weather.tempMax.toFixed(0)}°</b>
                            </div>

                        </div>

                        <div class="wp-slider-track">
                            <div class="wp-slider-bar"></div>
                            <div class="wp-slider-dot"></div>
                        </div>

                        <div class="wp-range-sub">
                            Günün sıcaklık aralığı
                        </div>

                    </div>

                    <div class="wp-details-list-card">

                        <div class="wp-detail-row">
                            <span class="wp-detail-label">💧 Nem</span>
                            <span class="wp-detail-val">
                                %${weather.humidity}
                            </span>
                        </div>

                        <div class="wp-detail-row">
                            <span class="wp-detail-label">💨 Rüzgar</span>
                            <span class="wp-detail-val">
                                ${(weather.windSpeed * 3.6).toFixed(0)} km/h
                                <span class="wp-sub-dir">
                                    ↗ ${windDirection}
                                </span>
                            </span>
                        </div>

                        <div class="wp-detail-row">
                            <span class="wp-detail-label">
                                👁️ Görüş
                            </span>

                            <span class="wp-detail-val">
                                ${(weather.visibility / 1000).toFixed(0)} km
                            </span>
                        </div>

                        <div class="wp-detail-row">
                            <span class="wp-detail-label">
                                🧭 Basınç
                            </span>

                            <span class="wp-detail-val">
                                ${pressureValue} hPa
                            </span>
                        </div>

                        <div class="wp-detail-row">
                            <span class="wp-detail-label">
                                🌧️ Yağış
                            </span>

                            <span class="wp-detail-val">
                                ${(weather.rainVolume || 0).toFixed(1)} mm
                            </span>
                        </div>

                    </div>

                </div>

                <div class="wp-right-column">

                    <div class="wp-right-widget">

                        <div class="wp-widget-title">
                            ☀️ GÜN DOĞUMU & BATIMI
                        </div>

                        <div class="wp-sun-arc-container">

                            <div class="wp-sun-extremes">

                                <div class="wp-sun-info-node">

                                    <span class="sun-icon-svg">🌅</span>

                                    <div class="sun-text-stack">

                                        <span class="sun-label-title">
                                            Gün Doğumu
                                        </span>

                                        <span class="sun-time-value">

                                            ${sunriseDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}

                                        </span>

                                    </div>

                                </div>

                                <div class="wp-sun-info-node text-right">

                                    <span class="sun-icon-svg">🌇</span>

                                    <div class="sun-text-stack">

                                        <span class="sun-label-title">
                                            Gün Batımı
                                        </span>

                                        <span class="sun-time-value">

                                            ${sunsetDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}

                                        </span>

                                    </div>

                                </div>

                            </div>

                            <div class="wp-sun-arc-rail">

                                <svg
                                    class="wp-arc-svg-line"
                                    viewBox="0 0 100 35">

                                    <path
                                        d="M 5,32 Q 50,2 95,32"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.15)"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                    />

                                    <circle
                                        cx="${sunX}"
                                        cy="${sunY}"
                                        r="3"
                                        fill="#ffb74d"
                                    />

                                </svg>

                            </div>

                        </div>

                    </div>

                    <div class="wp-right-widget">

                                   <div class="wp-pressure-gauge">

                <svg class="wp-pressure-svg" viewBox="0 0 120 70">

                    <path
                        d="M15 60 A45 45 0 0 1 105 60"
                        class="pressure-track" />

                    <path
                        d="M15 60 A45 45 0 0 1 105 60"
                        class="pressure-progress"
                        style="
                            stroke-dasharray:142;
                            stroke-dashoffset:${142 - (142 * pPercentage)};
                        " />

                </svg>

                <div
                    class="wp-pressure-needle"
                    style="transform:translateX(-50%) rotate(${speedoRotation}deg)">
                </div>

                <div class="wp-pressure-center"></div>

                <div class="wp-pressure-value ${pressureStatusClass}">
                    ${pressureValue}
                </div>

                <div class="wp-pressure-status ${pressureStatusClass}">
                    ${pressureStatus}
                </div>

            </div>

                    </div>

                    <div class="wp-right-widget">

                        <div class="wp-widget-title">
                            🧩 RÜZGAR PUSULASI
                        </div>

                        <div class="wp-wind-compass-widget">

                            <div class="wp-compass-ring">

                                <span class="wp-compass-letter n">N</span>
                                <span class="wp-compass-letter s">S</span>
                                <span class="wp-compass-letter w">W</span>
                                <span class="wp-compass-letter e">E</span>

                                <svg
                                    class="wp-compass-arrow-svg"
                                    viewBox="0 0 100 100"
                                    style="transform: rotate(${windDegree}deg);">

                                    <line
                                        x1="50"
                                        y1="50"
                                        x2="50"
                                        y2="12"
                                        stroke="#00e5ff"
                                        stroke-width="2.5"
                                    />

                                    <polygon
                                        points="50,6 46,15 54,15"
                                        fill="#00e5ff"
                                    />

                                </svg>

                                <div class="wp-compass-value-block">

                                    <span class="wind-speed-num">
                                        ${(weather.windSpeed * 3.6).toFixed(0)}
                                    </span>

                                    <span class="wind-unit-text">
                                        km/h
                                    </span>

                                </div>

                            </div>

                            <div class="wp-wind-compass-footer">

                                <span class="wind-compass-dir">
                                    ↗ ${windDirection} (${windDegree}°)
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="wp-bottom-section">

                         <div class="wp-forecast-header-toggle"
                 onclick="toggleForecastPanel()">

                <span>📅 Hava Durumu Zaman Çizelgesi</span>

                <span id="forecastArrow">▼</span>

            </div>

            <div
                id="forecastContent"
                class="wp-forecast-content">

                <div class="wp-forecast-container">
                    ${forecastHtml}
                </div>

         </div>

            </div>

        </div>
    `;

    panel.classList.add("open");

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