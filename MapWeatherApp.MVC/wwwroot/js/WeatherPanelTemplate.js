export function BuildForecastHtml(timeline) {

    const daysOfWeek = [
        "Paz",
        "Pzt",
        "Sal",
        "Çar",
        "Per",
        "Cum",
        "Cmt"
    ];

    return timeline.map(day => {

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
            }
        );

        return `
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
                    ${Number(day.tempMax).toFixed(1)}°
                </div>

                <div class="weather-forecast-min">
                    ${Number(day.tempMin).toFixed(1)}°
                </div>

            </div>
        `;
    }).join("");
}


export function BuildWeatherPanelHtml(
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
) {
    let temperaturePercentage = 50;

    if (weather.tempMax !== weather.tempMin) {
        temperaturePercentage = ((weather.temperature - weather.tempMin) / (weather.tempMax - weather.tempMin)) * 100;
        temperaturePercentage = Math.max(0, Math.min(100, temperaturePercentage));
    }

    return `
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
                            href="${cityData?.wiki || "#"}"
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
                            ${weather.temperature.toFixed(1)}
                            <span class="wp-celsius">°C</span>
                        </div>

                        <div class="wp-feels-like">
                            Hissedilen:
                            ${weather.feelsLike.toFixed(1)}°C
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
                                <b>${weather.tempMin.toFixed(1)}°</b>
                            </div>

                            <div class="wp-extreme-val">
                                <span>🔥 En Yüksek</span>
                                <b>${weather.tempMax.toFixed(1)}°</b>
                            </div>

                        </div>

                        <div class="wp-slider-track">
                          <div class="wp-slider-bar"></div>

                          <div
                              class="wp-slider-dot"
                              style="left: ${temperaturePercentage}%;">
                          </div>
                        </div>

                        <div class="wp-range-sub">
                            Günün sıcaklık aralığı
                        </div>

                    </div>


                    <div class="wp-details-list-card">

                        <div class="wp-detail-row">

                            <span class="wp-detail-label">
                                💧 Nem
                            </span>

                            <span class="wp-detail-val">
                                %${weather.humidity}
                            </span>

                        </div>


                        <div class="wp-detail-row">

                            <span class="wp-detail-label">
                                💨 Rüzgar
                            </span>

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
                                ${pressure.value} hPa
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

                                    <span class="sun-icon-svg">
                                        🌅
                                    </span>

                                    <div class="sun-text-stack">

                                        <span class="sun-label-title">
                                            Gün Doğumu
                                        </span>

                                        <span class="sun-time-value">

                                            ${sunriseDate.toLocaleTimeString(
        "tr-TR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    )}

                                        </span>

                                    </div>

                                </div>


                                <div class="wp-sun-info-node text-right">

                                    <span class="sun-icon-svg">
                                        🌇
                                    </span>

                                    <div class="sun-text-stack">

                                        <span class="sun-label-title">
                                            Gün Batımı
                                        </span>

                                        <span class="sun-time-value">

                                            ${sunsetDate.toLocaleTimeString(
        "tr-TR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    )}

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
                                        cx="${sunPosition.x}"
                                        cy="${sunPosition.y}"
                                        r="3"
                                        fill="#ffb74d"
                                    />

                                </svg>

                            </div>

                        </div>

                    </div>


                    <div class="wp-right-widget">

                        <div class="wp-pressure-gauge">

                            <svg
                                class="wp-pressure-svg"
                                viewBox="0 0 120 70">

                                <path
                                    d="M15 60 A45 45 0 0 1 105 60"
                                    class="pressure-track"
                                />

                                <path
                                    d="M15 60 A45 45 0 0 1 105 60"
                                    class="pressure-progress"
                                    style="
                                        stroke-dasharray:142;
                                        stroke-dashoffset:${142 - (142 * pressure.percentage)};
                                    "
                                />

                            </svg>


                            <div
                                class="wp-pressure-needle"
                                style="
                                    transform:translateX(-50%) rotate(${pressure.rotation}deg)
                                ">
                            </div>


                            <div class="wp-pressure-center"></div>


                            <div class="wp-pressure-value ${pressure.statusClass}">
                                ${pressure.value}
                            </div>


                            <div class="wp-pressure-status ${pressure.statusClass}">
                                ${pressure.status}
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
                                    style="
                                        transform: rotate(${windDegree}deg);
                                    ">

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

                <div
                    class="wp-forecast-header-toggle"
                    onclick="toggleForecastPanel()">

                    <span>
                        📅 Hava Durumu Zaman Çizelgesi
                    </span>

                    <span id="forecastArrow">
                        ▼
                    </span>

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
}