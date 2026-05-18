import { GetMap } from "./Map.js";

import {
    GetColorByTemperature,
    GetColorByWind,
    GetColorByRain
}
    from "./BorderColor.js";

import { MakeDraggableControl }
    from "./Draggable.js";

import { GetMapMode }
    from "./MapMode.js";

let legendControl = null;

export function GetLegendControl() {

    return legendControl;
}

export function AddLegend() {

    const map = GetMap();

    if (!map) return;

    // eski legend varsa kaldır
    if (legendControl) {

        map.removeControl(legendControl);

        legendControl = null;
    }

    legendControl = L.control({

        position: "bottomright"
    });

    legendControl.onAdd = function () {

        const div =
            L.DomUtil.create(
                "div",
                "info legend"
            );

        Object.assign(div.style, {

            position: "relative",

            background:
                "rgba(255,255,255,0.82)",

            backdropFilter:
                "blur(10px)",

            WebkitBackdropFilter:
                "blur(10px)",

            borderRadius: "10px",

            boxShadow:
                "0 4px 12px rgba(0,0,0,0.25)",

            fontSize: "13px",

            lineHeight: "18px",

            overflow: "visible",

            minWidth: "140px",

            userSelect: "none",

            paddingTop: "10px"
        });

        // CONTENT
        const content =
            document.createElement("div");

        content.style.padding =
            "8px";

        // TITLE
        const titleElement =
            document.createElement("div");

        Object.assign(titleElement.style, {

            textAlign: "center",

            fontWeight: "700",

            fontSize: "14px",

            marginTop: "4px",

            marginBottom: "8px",

            color: "#222"
        });

        // TOGGLE BAR
        const toggleBar =
            document.createElement("div");

        let isLegendOpen = true;

        toggleBar.innerHTML = "▼";

        Object.assign(toggleBar.style, {

            position: "absolute",

            top: "-8px",

            left: "0",

            width: "100%",

            height: "14px",

            background: "#1e1e1e",

            color: "white",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            cursor: "pointer",

            borderTopLeftRadius: "10px",

            borderTopRightRadius: "10px",

            fontSize: "7px",

            fontWeight: "bold",

            transition: "0.2s"
        });

        toggleBar.onmouseenter = () => {

            toggleBar.style.background =
                "#2d2d2d";
        };

        toggleBar.onmouseleave = () => {

            toggleBar.style.background =
                "#1e1e1e";
        };

        toggleBar.onclick = () => {

            isLegendOpen = !isLegendOpen;

            content.style.display =
                isLegendOpen
                    ? "block"
                    : "none";

            toggleBar.innerHTML =
                isLegendOpen
                    ? "▼"
                    : "▲";
        };

        function renderLegend() {

            let ranges = [];

            let title = "";

            const currentMapMode =
                GetMapMode();

            // TEMPERATURE
            if (
                currentMapMode ===
                "temperature"
            ) {

                title =
                    "🌡️ Sıcaklık";

                ranges = [

                    {
                        label: "-50+",
                        color:
                            GetColorByTemperature(-55)
                    },

                    {
                        label: "-50 – -40",
                        color:
                            GetColorByTemperature(-45)
                    },

                    {
                        label: "-40 – -30",
                        color:
                            GetColorByTemperature(-35)
                    },

                    {
                        label: "-30 – -20",
                        color:
                            GetColorByTemperature(-25)
                    },

                    {
                        label: "-20 – -10",
                        color:
                            GetColorByTemperature(-15)
                    },

                    {
                        label: "-10 – 0",
                        color:
                            GetColorByTemperature(-5)
                    },

                    {
                        label: "0 – 10",
                        color:
                            GetColorByTemperature(5)
                    },

                    {
                        label: "10 – 20",
                        color:
                            GetColorByTemperature(15)
                    },

                    {
                        label: "20 – 30",
                        color:
                            GetColorByTemperature(25)
                    },

                    {
                        label: "30 – 40",
                        color:
                            GetColorByTemperature(35)
                    },

                    {
                        label: "40 – 50",
                        color:
                            GetColorByTemperature(45)
                    },

                    {
                        label: "50+",
                        color:
                            GetColorByTemperature(55)
                    }
                ];
            }

            // WIND
            if (
                currentMapMode ===
                "wind"
            ) {

                title =
                    "💨 Rüzgar";

                ranges = [

                    {
                        label: "0 – 5",
                        color:
                            GetColorByWind(2)
                    },

                    {
                        label: "5 – 15",
                        color:
                            GetColorByWind(10)
                    },

                    {
                        label: "15 – 25",
                        color:
                            GetColorByWind(20)
                    },

                    {
                        label: "25 – 40",
                        color:
                            GetColorByWind(30)
                    },

                    {
                        label: "40+",
                        color:
                            GetColorByWind(50)
                    }
                ];
            }

            // RAIN
            if (
                currentMapMode ===
                "rain"
            ) {

                title =
                    "🌧️ Yağış";

                ranges = [

                    {
                        label: "0",
                        color:
                            GetColorByRain(0)
                    },

                    {
                        label: "0 – 2",
                        color:
                            GetColorByRain(1)
                    },

                    {
                        label: "2 – 5",
                        color:
                            GetColorByRain(3)
                    },

                    {
                        label: "5 – 15",
                        color:
                            GetColorByRain(10)
                    },

                    {
                        label: "15+",
                        color:
                            GetColorByRain(20)
                    }
                ];
            }

            titleElement.innerHTML =
                title;

            // sıcaklık özel 2 kolon
            if (
                currentMapMode ===
                "temperature"
            ) {

                content.innerHTML = `

                    <div style="
                        display:flex;
                        gap:8px;
                        justify-content:center;
                    ">

                        <div>

                            ${ranges.slice(0, 6).map(r => `

                                <div class="legend-item">

                                    <div
                                        class="legend-box"
                                        style="
                                            background:${r.color}
                                        "
                                    >

                                        ${r.label}

                                    </div>

                                </div>

                            `).join("")}

                        </div>

                        <div>

                            ${ranges.slice(6).map(r => `

                                <div class="legend-item">

                                    <div
                                        class="legend-box"
                                        style="
                                            background:${r.color}
                                        "
                                    >

                                        ${r.label}

                                    </div>

                                </div>

                            `).join("")}

                        </div>

                    </div>
                `;
            }
            else {

                content.innerHTML =

                    ranges.map(r => `

                        <div class="legend-item">

                            <div
                                class="legend-box"
                                style="
                                    background:${r.color}
                                "
                            >

                                ${r.label}

                            </div>

                        </div>

                    `).join("");
            }
        }

        renderLegend();

        div.appendChild(toggleBar);

        div.appendChild(titleElement);

        div.appendChild(content);

        L.DomEvent
            .disableClickPropagation(div);

        L.DomEvent
            .disableScrollPropagation(div);

        MakeDraggableControl(div);

        div._renderLegend = () => {

            if (
                typeof renderLegend ===
                "function"
            ) {

                renderLegend();
            }
        };

        return div;
    };

    legendControl.addTo(map);
}