import { GetMap } from "./Map.js";
import { MakeDraggableControl } from "./Draggable.js";

window.CloseWeatherPanelGlobal = function () {
    CloseWeatherPanel();
};

export function OpenWeatherPanel(weather, latlng) {
    const map = GetMap();
    if (!map) return;

    const panel = document.getElementById("weatherDetailPanel");
    if (!panel) return;

    const point = map.latLngToContainerPoint(latlng);
    panel.style.left = `${point.x - 490}px`;
    panel.style.top = `${point.y - 310}px`;

    const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const today = new Date();

    let forecastHtml = "";
    for (let i = 0; i < 10; i++) {
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + i);

        const dayName = i === 0 ? "Bugün" : daysOfWeek[nextDate.getDay()];
        const dayString = nextDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

        const mockMax = (weather.temperature + (i % 2 === 0 ? i * 0.3 : -i * 0.4)).toFixed(0);
        const mockMin = (weather.feelsLike - 4 - (i % 2 === 0 ? i * 0.2 : -i * 0.4)).toFixed(0);
        const mockRain = Math.max(10, Math.min(90, Math.round(weather.humidity - (i * 4))));

        forecastHtml += `
            <div class="weather-forecast-day">
                <div class="weather-forecast-name">${dayName}</div>
                <div class="weather-forecast-date">${dayString}</div>
                <img class="weather-forecast-icon" src="https://openweathermap.org/img/wn/${weather.conditionIcon}@2x.png" />
                <div class="weather-forecast-temp">${mockMax}°</div>
                <div class="weather-forecast-min">${mockMin}°</div>
                <div class="weather-forecast-rain">💧 %${mockRain}</div>
            </div>
        `;
    }

    const pressureValue = weather.pressure || 1012;
    const minP = 960;
    const maxP = 1060;
    const pPercentage = (pressureValue - minP) / (maxP - minP);
    const speedoRotation = -90 + (pPercentage * 180);

    const currentHour = new Date().getHours();
    let sunProgress = 0;
    if (currentHour >= 5 && currentHour <= 20) {
        sunProgress = ((currentHour - 5) / (20 - 5)) * 100;
    } else if (currentHour > 20) {
        sunProgress = 100;
    }

    panel.innerHTML = `
        <div class="weather-dashboard">
            <button id="closeWeatherPanel" class="weather-close-btn" onclick="window.CloseWeatherPanelGlobal()">✕</button>

            <div class="weather-main-grid">
                
                <div class="wp-left-card">
                    <div class="wp-header">
                        <div class="wp-location-wrapper">
                            <span class="wp-geo-icon">📍</span>
                            <span class="wp-city-name">${weather.city}</span>
                            <span class="wp-dropdown-arrow">▼</span>
                        </div>
                        <div class="wp-country-name">Türkiye</div>
                    </div>

                    <div class="wp-center-info">
                        <img class="wp-big-icon" src="https://openweathermap.org/img/wn/${weather.conditionIcon}@4x.png" />
                        <div class="wp-condition-desc">${weather.conditionDescription}</div>
                        <div class="wp-main-temp">${weather.temperature.toFixed(0)}<span class="wp-celsius">°C</span></div>
                        <div class="wp-feels-like">Hissedilen: ${weather.feelsLike.toFixed(0)}°C</div>
                    </div>

                    <div class="wp-footer-action">
                        <button class="wp-umbrella-btn">☔ Şemsiye almayı unutma!</button>
                    </div>
                </div>

                <div class="wp-middle-column">
                    <div class="wp-temp-range-card">
                        <div class="wp-temp-range-text">
                            <div class="wp-extreme-val"><span>❄️ En Düşük</span> <b>11°</b></div>
                            <div class="wp-extreme-val"><span>🔥 En Yüksek</span> <b>18°</b></div>
                        </div>
                        <div class="wp-slider-track">
                            <div class="wp-slider-bar"></div>
                            <div class="wp-slider-dot"></div>
                        </div>
                        <div class="wp-range-sub">Günün en düşük ve en yüksek sıcaklık limitleri</div>
                    </div>

                    <div class="wp-details-list-card">
                        <div class="wp-detail-row">
                            <span class="wp-detail-label">💧 Nem</span>
                            <span class="wp-detail-val">%${weather.humidity}</span>
                        </div>
                        <div class="wp-detail-row">
                            <span class="wp-detail-label">💨 Rüzgar</span>
                            <span class="wp-detail-val">${(weather.windSpeed * 3.6).toFixed(0)} km/h <span class="wp-sub-dir">↗ KD</span></span>
                        </div>
                        <div class="wp-detail-row">
                            <span class="wp-detail-label">👁️ Görüş Mesafesi</span>
                            <span class="wp-detail-val">${(weather.visibility / 1000).toFixed(0)} km</span>
                        </div>
                        <div class="wp-detail-row">
                            <span class="wp-detail-label">🧭 Basınç</span>
                            <span class="wp-detail-val">${pressureValue} hPa</span>
                        </div>
                        <div class="wp-detail-row">
                            <span class="wp-detail-label">🌧️ Yağış</span>
                            <span class="wp-detail-val">${(weather.rainVolume || 0).toFixed(1)} mm</span>
                        </div>
                        <div class="wp-detail-row no-border">
                            <span class="wp-detail-label">☀️ UV İndeksi</span>
                            <span class="wp-detail-val">3 (Orta)</span>
                        </div>
                    </div>
                </div>

                <div class="wp-right-column">
                    
                    <div class="wp-right-widget">
                        <div class="wp-widget-title">☀️ GÜN DOĞUMU & BATIMI</div>
                        <div class="wp-sun-arc-container">
                            <div class="wp-sun-extremes">
                                <div class="wp-sun-info-node">
                                    <span class="sun-icon-svg">🌅</span>
                                    <div class="sun-text-stack">
                                        <span class="sun-label-title">Genel</span>
                                        <span class="sun-time-value">05:37</span>
                                    </div>
                                </div>
                                <div class="wp-sun-info-node text-right">
                                    <span class="sun-icon-svg">🌇</span>
                                    <div class="sun-text-stack">
                                        <span class="sun-label-title">Genel</span>
                                        <span class="sun-time-value">20:11</span>
                                    </div>
                                </div>
                            </div>
                            <div class="wp-sun-arc-rail">
                                <svg class="wp-arc-svg-line" viewBox="0 0 100 35">
                                    <path d="M 5,32 Q 50,2 95,32" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <div class="wp-sun-moving-dot" style="left: calc(${sunProgress}% - 5px); bottom: ${sunProgress > 0 && sunProgress < 100 ? '22px' : '2px'};"></div>
                            </div>
                        </div>
                    </div>

                    <div class="wp-right-widget">
                        <div class="wp-widget-title">🧭 BASINÇ SAATİ</div>
                        <div class="wp-speedo-gauge-container">
                            <div class="wp-speedo-dial">
                                <div class="wp-speedo-needle" style="transform: translate(-50%, -100%) rotate(${speedoRotation}deg);"></div>
                                <div class="wp-speedo-center"></div>
                            </div>
                            <div class="wp-speedo-data">
                                <div class="wp-speedo-value">${pressureValue} <span class="wp-speedo-unit">hPa</span></div>
                                <div class="wp-speedo-status">SABİT</div>
                            </div>
                        </div>
                    </div>

                    <div class="wp-right-widget">
                        <div class="wp-widget-title">💨 RÜZGAR</div>
                        <div class="wp-wind-compass-widget">
                            <div class="wp-compass-ring">
                                <span class="wp-compass-letter n">N</span>
                                <span class="wp-compass-letter s">S</span>
                                <span class="wp-compass-letter w">W</span>
                                <span class="wp-compass-letter e">E</span>
                                
                                <div class="wp-compass-dial-ticks"></div>
                                
                                <div class="wp-compass-value-block">
                                    <span class="wind-speed-num">${(weather.windSpeed * 3.6).toFixed(0)}</span>
                                    <span class="wind-unit-text">km/h</span>
                                </div>
                            </div>
                            
                            <div class="wp-wind-compass-footer">
                                <span class="wind-compass-dir">↘ KD</span>
                                <span class="wind-compass-status">${(weather.windSpeed * 3.6) > 15 ? 'RÜZGARLI' : 'SAKİN'}</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div class="wp-bottom-section">
                <div class="wp-forecast-header">
                    <span>🗓️ 10 Günlük Tahmin</span>
                </div>
                <div class="wp-forecast-container">
                    ${forecastHtml}
                </div>
            </div>

        </div>
    `;

    panel.classList.add("open");

    requestAnimationFrame(() => {
        MakeDraggableControl(panel);
    });
}

export function CloseWeatherPanel() {
    const panel = document.getElementById("weatherDetailPanel");
    if (!panel) return;
    panel.classList.remove("open");
}