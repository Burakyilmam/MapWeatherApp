import { GetMap } from "./Map.js";

import {
    GetColorByTemperature,
    GetColorByWind,
    GetColorByRain
}
    from "./BorderColor.js";

import { MakeDraggableControl }
    from "./Draggable.js";

import { GetCityLayer }
    from "./CityBorder.js";

import { GetLegendControl }
    from "./Legend.js";

let currentMapMode = "temperature";

let isCollapsed = false;

let modeControlInstance = null;

// GET
export function GetMapMode() {

    return currentMapMode;
}

// CONTROL
export function AddMapMode() {

    const map = GetMap();

    if (!map) return;

    // eski varsa kaldır
    if (
        modeControlInstance &&
        modeControlInstance.remove
    ) {

        modeControlInstance.remove();

        modeControlInstance = null;
    }

    const ModeControl =
        L.Control.extend({

            options: {
                position: "topleft"
            },

            onAdd: function () {

                const div =
                    L.DomUtil.create("div");

                Object.assign(div.style, {

                    position: "relative",

                    background: "rgba(255,255,255,0.82)",

                    backdropFilter: "blur(10px)",

                    WebkitBackdropFilter: "blur(10px)",

                    borderRadius: "10px",

                    boxShadow:
                        "0 4px 12px rgba(0,0,0,0.2)",

                    padding: "8px",

                    display: "flex",

                    flexDirection: "column",

                    gap: "6px",

                    fontSize: "13px",

                    minWidth: "170px",

                    transition: "0.2s"
                });

                const modes = [

                    {
                        id: "temperature",
                        icon: "🌡️",
                        label: "Sıcaklık"
                    },

                    {
                        id: "wind",
                        icon: "💨",
                        label: "Rüzgar"
                    },

                    {
                        id: "rain",
                        icon: "🌧️",
                        label: "Yağış"
                    }
                ];

                // BUTTON REFRESH
                div._updateButtons = function () {

                    div.style.minWidth =
                        isCollapsed
                            ? "58px"
                            : "170px";

                    Array
                        .from(div.children)

                        .forEach(child => {

                            const modeId =
                                child.dataset?.mode;

                            if (!modeId) return;

                            const mode =
                                modes.find(
                                    x => x.id === modeId
                                );

                            child.innerHTML =
                                isCollapsed
                                    ? mode.icon
                                    : `${mode.icon} ${mode.label}`;

                            child.style.background =
                                modeId === currentMapMode
                                    ? "#e3f2fd"
                                    : "transparent";

                            child.style.justifyContent =
                                isCollapsed
                                    ? "center"
                                    : "flex-start";
                        });
                };

                // BUTTON CREATE
                modes.forEach(m => {

                    const btn =
                        document.createElement(
                            "div"
                        );

                    btn.dataset.mode = m.id;

                    btn.innerHTML =
                        isCollapsed
                            ? m.icon
                            : `${m.icon} ${m.label}`;

                    Object.assign(btn.style, {

                        cursor: "pointer",

                        padding: "8px 10px",

                        borderRadius: "6px",

                        transition: "0.2s",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "flex-start",

                        background:
                            m.id === currentMapMode
                                ? "#e3f2fd"
                                : "transparent"
                    });

                    // hover
                    btn.onmouseenter = () => {

                        btn.style.background =
                            "#f1f1f1";

                        btn.style.transform =
                            "scale(1.03)";
                    };

                    btn.onmouseleave = () => {

                        btn.style.transform =
                            "scale(1)";

                        div._updateButtons();
                    };

                    // click
                    btn.onclick = () => {

                        SetMapMode(m.id);

                        div._updateButtons();
                    };

                    div.appendChild(btn);
                });

                // TOGGLE BUTTON
                const toggleBtn =
                    document.createElement("div");

                toggleBtn.innerHTML =
                    isCollapsed
                        ? "▶"
                        : "◀";

                Object.assign(toggleBtn.style, {

                    position: "absolute",

                    top: "0",

                    right: "-8px",

                    width: "8px",

                    height: "100%",

                    background: "#1e1e1e",

                    color: "white",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    cursor: "pointer",

                    borderTopRightRadius: "10px",

                    borderBottomRightRadius: "10px",

                    boxShadow:
                        "2px 0 8px rgba(0,0,0,0.2)",

                    fontSize: "6px",

                    fontWeight: "bold",

                    transition: "0.2s"
                });

                toggleBtn.onmouseenter = () => {

                    toggleBtn.style.background =
                        "#2d2d2d";
                };

                toggleBtn.onmouseleave = () => {

                    toggleBtn.style.background =
                        "#1e1e1e";
                };

                toggleBtn.onclick = () => {

                    isCollapsed = !isCollapsed;

                    toggleBtn.innerHTML =
                        isCollapsed
                            ? "▶"
                            : "◀";

                    div._updateButtons();
                };

                div.appendChild(toggleBtn);

                L.DomEvent
                    .disableClickPropagation(div);

                L.DomEvent
                    .disableScrollPropagation(div);

                MakeDraggableControl(div);

                return div;
            }
        });

    modeControlInstance =
        new ModeControl();

    map.addControl(
        modeControlInstance
    );
}

// SET
export function SetMapMode(mode) {

    currentMapMode = mode;

    const cityLayer =
        GetCityLayer();

    if (!cityLayer) return;

    const legendControl =
        GetLegendControl();

    cityLayer.eachLayer(layer => {

        const weather =
            layer._weatherData;

        if (!weather) return;

        let color = "#ccc";

        switch (mode) {

            case "temperature":

                color =
                    GetColorByTemperature(
                        weather.temperature
                    );

                break;

            case "wind":

                color =
                    GetColorByWind(
                        weather.windSpeed
                    );

                break;

            case "rain":

                color =
                    GetColorByRain(
                        weather.rainVolume
                    );

                break;
        }

        layer.setStyle({

            fillColor: color,

            fillOpacity: 0.6
        });
    });

    // legend refresh
    if (
        legendControl?._container
            ?._renderLegend
    ) {

        legendControl
            ._container
            ._renderLegend();
    }
}