import { GetMap } from './Map.js';
import { GetColorByTemperature } from './BorderColor.js';

export async function TurkeyGeoJsonDatas() {

    const map = GetMap();

    if (!map) return;

    const geoUrl =
        "https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json";

    try {

        // API'den weather dataları çek
        const weatherResponse = await fetch("https://localhost:7271/api/weather/all");
        const weatherData = await weatherResponse.json();

        // GeoJSON çek
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        cityLayer = L.geoJSON(geoData, {

            style: () => ({
                color: "#555",
                weight: 1,
                fill: true,
                fillOpacity: 0.5
            }),

            onEachFeature: function (feature, layer) {

                const cityName = feature.properties.name;

                // API'deki şehri bul
                const weather = weatherData.find(x => x.city === cityName);

                if (!weather) return;

                // sıcaklığa göre renk
                layer.setStyle({
                    fillColor: GetColorByTemperature(
                        weather.temperature
                    )
                });

                // tooltip
                layer.bindTooltip(`
                    <div style="font-family:Arial;">

                        <div style="font-weight:bold;">
                            ${weather.city}
                        </div>

                        <div style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                            margin-top:5px;
                        ">

                            <img
                                src="https:${weather.icon}"
                                width="28"
                            />

                            <span>
                                ${weather.temperature} °C
                            </span>
                        </div>

                        <div style="margin-top:4px;">
                            ${weather.condition}
                        </div>

                    </div>
                `);

                // hover effect
                layer.on('mouseover', () => {
                    layer.setStyle({
                        weight: 3
                    });
                });

                layer.on('mouseout', () => {
                    layer.setStyle({
                        weight: 1
                    });
                });

                // click popup
                layer.on('click', () => {

                    layer.bindPopup(`
                        <div style="
                            text-align:center;
                            min-width:200px;
                        ">

                            <h5>
                                ${weather.city}
                            </h5>

                            <img
                                src="https:${weather.icon}"
                                width="64"
                            />

                            <p>
                                🌡️ ${weather.temperature}°C
                            </p>

                            <p>
                                💨 ${weather.windSpeed} km/s
                            </p>

                            <p>
                                💧 ${weather.humidity}%
                            </p>

                            <p>
                                ${weather.condition}
                            </p>

                        </div>
                    `).openPopup();

                });
            }

        }).addTo(map);

        map.fitBounds(cityLayer.getBounds());

    }
    catch (err) {

        console.error("GeoJSON / Weather yüklenemedi", err);
    }
}