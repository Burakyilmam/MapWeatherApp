import { GetMap } from "./Map.js";
import { MakeDraggableControl } from "./Draggable.js";
import { SetMapMode, RefreshMapModeButtons } from "./MapMode.js";
import { FlyToCity } from "./Utility.js";
import { GetWeatherData } from "./CityBorder.js";

let dailyInfoControl = null;
let latestWeatherData = [];

export function GetDailyLeaders() {

    latestWeatherData = GetWeatherData();

    if (!latestWeatherData || latestWeatherData.length === 0) {
        return null;
    }

    let hottest = latestWeatherData[0];
    let coldest = latestWeatherData[0];
    let windiest = latestWeatherData[0];
    let rainiest = latestWeatherData[0];
    let snowiest = latestWeatherData[0];
    let mostHumid = latestWeatherData[0];
    let cloudiest = latestWeatherData[0];
    let foggiest = latestWeatherData[0];
    let highestPressure = latestWeatherData[0];

    latestWeatherData.forEach(w => {

        if (w.temperature > hottest.temperature) hottest = w;
        if (w.temperature < coldest.temperature) coldest = w;

        if ((w.windSpeed || 0) > (windiest.windSpeed || 0)) windiest = w;
        if ((w.rainVolume || 0) > (rainiest.rainVolume || 0)) rainiest = w;
        if ((w.snowVolume || 0) > (snowiest.snowVolume || 0)) snowiest = w;
        if ((w.humidity || 0) > (mostHumid.humidity || 0)) mostHumid = w;
        if ((w.cloudiness || 0) > (cloudiest.cloudiness || 0)) cloudiest = w;
        if ((w.visibility || 999999) < (foggiest.visibility || 999999)) foggiest = w;
        if ((w.pressure || 0) > (highestPressure.pressure || 0)) highestPressure = w;
    });

    return {
        hottest,
        coldest,
        windiest,
        rainiest,
        snowiest,
        mostHumid,
        cloudiest,
        foggiest,
        highestPressure
    };
}

export function AddDailyLeaderPanel() {

    const map = GetMap();

    if (!map) return;

    if (dailyInfoControl && dailyInfoControl.remove) {

        dailyInfoControl.remove();

        dailyInfoControl = null;
    }

    const InfoControl = L.Control.extend({

        options: {
            position: "topright"
        },

        onAdd: function () {

            const div = L.DomUtil.create("div", "daily-summary-panel");

            Object.assign(div.style, {

                position: "relative",

                background: "rgba(255,255,255,0.85)",

                backdropFilter: "blur(12px)",

                WebkitBackdropFilter: "blur(12px)",

                border: "1px solid rgba(255,255,255,0.3)",

                borderRadius: "14px",

                boxShadow: "0 8px 28px rgba(0,0,0,0.15)",

                overflow: "visible",

                minWidth: "280px",

                fontSize: "13px",

                userSelect: "none",

                paddingTop: "14px"
            });

            const toggleBar = document.createElement("div");

            let isOpen = true;

            toggleBar.innerHTML = "▼";

            Object.assign(toggleBar.style, {

                position: "absolute",

                top: "0",

                left: "0",

                width: "100%",

                height: "16px",

                background: "#1e1e1e",

                color: "white",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                cursor: "pointer",

                borderTopLeftRadius: "14px",

                borderTopRightRadius: "14px",

                fontSize: "8px",

                fontWeight: "bold",

                transition: "0.2s"
            });

            const content = document.createElement("div");

            content.style.padding = "12px";

            toggleBar.onmouseenter = () => {

                toggleBar.style.background = "#2d2d2d";
            };

            toggleBar.onmouseleave = () => {

                toggleBar.style.background = "#1e1e1e";
            };

            toggleBar.onclick = () => {

                isOpen = !isOpen;

                content.style.display = isOpen ? "block" : "none";

                toggleBar.innerHTML = isOpen ? "▼" : "▲";
            };

            const stats = GetDailyLeaders();

            const title = document.createElement("div");

            title.innerHTML = "📊 Günlük Özet";

            Object.assign(title.style, {

                fontWeight: "700",

                fontSize: "14px",

                textAlign: "center",

                padding: "10px 12px 4px 12px",

                color: "#222"
            });

            div.appendChild(title);

            let htmlContent = "";

            if (stats) {

                let leaderItems = [];

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.hottest.city}" data-mode="temperature">
                        🔥 <div><div style="font-weight:700;">En Sıcak</div><div>${stats.hottest.city} — ${stats.hottest.temperature.toFixed(1)} °C</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.coldest.city}" data-mode="temperature">
                        ❄️ <div><div style="font-weight:700;">En Soğuk</div><div>${stats.coldest.city} — ${stats.coldest.temperature.toFixed(1)} °C</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.windiest.city}" data-mode="wind">
                        💨 <div><div style="font-weight:700;">En Rüzgarlı</div><div>${stats.windiest.city} — ${(stats.windiest.windSpeed * 3.6).toFixed(1)} km/h</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.rainiest.city}" data-mode="rain">
                        🌧️ <div><div style="font-weight:700;">En Yağışlı</div><div>${stats.rainiest.city} — ${(stats.rainiest.rainVolume || 0).toFixed(1)} mm</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.snowiest.city}" data-mode="snow">
                        🌨️ <div><div style="font-weight:700;">En Karlı</div><div>${stats.snowiest.city} — ${(stats.snowiest.snowVolume || 0).toFixed(1)} mm</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.mostHumid.city}" data-mode="humidity">
                        💧 <div><div style="font-weight:700;">En Nemli</div><div>${stats.mostHumid.city} — ${stats.mostHumid.humidity}%</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.cloudiest.city}" data-mode="cloud">
                        ☁️ <div><div style="font-weight:700;">En Bulutlu</div><div>${stats.cloudiest.city} — ${stats.cloudiest.cloudiness}%</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.foggiest.city}" data-mode="visibility">
                        🌫️ <div><div style="font-weight:700;">En Sisli</div><div>${stats.foggiest.city} — ${(stats.foggiest.visibility / 1000).toFixed(1)} km</div></div>
                    </div>
                `);

                leaderItems.push(`
                    <div class="summary-item" data-city="${stats.highestPressure.city}" data-mode="pressure">
                        ⏲️ <div><div style="font-weight:700;">En Yüksek Basınç</div><div>${stats.highestPressure.city} — ${stats.highestPressure.pressure} hPa</div></div>
                    </div>
                `);

                htmlContent += `

                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:10px;
                        align-items:start;
                    ">

                        <div>
                            ${leaderItems.slice(0, 5).join("")}
                        </div>

                        <div>
                            ${leaderItems.slice(5).join("")}
                        </div>

                    </div>
                `;
            }
            else {

                htmlContent += `

                    <div style="
                        text-align:center;
                        opacity:0.7;
                        padding:10px;
                    ">

                        Veri yükleniyor...

                    </div>
                `;
            }

            content.innerHTML = htmlContent;

            div.appendChild(toggleBar);

            div.appendChild(content);

            if (stats) {

                div.querySelectorAll(".summary-item").forEach(el => {

                    el.addEventListener("click", function () {

                        const city = this.dataset.city;

                        const mode = this.dataset.mode;

                        FocusLeader(city, mode);
                    });
                });
            }

            L.DomEvent.disableClickPropagation(div);

            L.DomEvent.disableScrollPropagation(div);

            MakeDraggableControl(div);

            return div;
        }
    });

    dailyInfoControl = new InfoControl();

    map.addControl(dailyInfoControl);
}

export function FocusLeader(cityName, mode) {

    SetMapMode(mode);

    RefreshMapModeButtons();

    setTimeout(() => {

        FlyToCity(cityName);

    }, 150);
}