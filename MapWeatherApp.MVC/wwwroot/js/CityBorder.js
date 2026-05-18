import { GetMap } from './Map.js';
import { GetColorByTemperature } from './BorderColor.js';

let cityLayer = null;

export async function TurkeyGeoJsonDatas() {

    const map = GetMap();

    if (!map) return;

    const geoUrl =
        "https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json";

    try {

        // Weather API
        const weatherResponse =
            await fetch(
                "https://localhost:7271/api/weather/latest"
            );

        const weatherData =
            await weatherResponse.json();

        // GeoJSON
        const geoResponse =
            await fetch(geoUrl);

        const geoData =
            await geoResponse.json();

        if (cityLayer) {
            map.removeLayer(cityLayer);
        }

        cityLayer = L.geoJSON(geoData, {

            style: () => ({
                color: "#555",
                weight: 1,
                fill: true,
                fillOpacity: 0.5
            }),

            onEachFeature: function (feature, layer) {

                const cityName = feature.properties.name;

                const weather = weatherData.find(x => x.city === cityName);

                if (!weather) return;

                // sıcaklığa göre renk
                layer.setStyle({
                    fillColor:
                        GetColorByTemperature(weather.temperature)
                });

                // tooltip
                layer.bindTooltip(`
                    
                    <div style="
                        font-family:Arial;
                        min-width:180px;
                    ">

                        <div style="
                            font-weight:bold;
                            font-size:15px;
                            margin-bottom:6px;
                        ">
                            ${weather.city}
                        </div>

                        <div style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                        ">

                            <img
                                src="https://openweathermap.org/img/wn/${weather.conditionIcon}@2x.png"
                                width="42"
                            />

                            <div>

                                <div>
                                     ${weather.temperature.toFixed(1)} °C
                                </div>

                                <div>
                                    ${weather.feelsLike.toFixed(1)} °C
                                </div>

                            </div>

                        </div>

                        <div style="margin-top:6px;">
                            ${weather.conditionDescription}
                        </div>

                    </div>

                `);

                // hover
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

                // popup
                layer.on('click', () => {

                    layer.bindPopup(`

                        <div style="
                            text-align:center;
                            min-width:220px;
                        ">

                            <h5>
                                ${weather.city}
                            </h5>

                            <img
                                src="https://openweathermap.org/img/wn/${weather.conditionIcon}@2x.png"
                                width="80"
                            />

                            <hr/>

                            <p>
                                ${weather.temperature.toFixed(1)} °C
                            </p>

                            <p>
                                ${weather.feelsLike.toFixed(1)} °C
                            </p>

                            <p>
                                ${weather.humidity}%
                            </p>

                            <p>
                                ${weather.windSpeed} m/s
                            </p>

                            <p>
                                ${weather.windDegree}°
                            </p>

                            <p>
                                ${weather.cloudiness}%
                            </p>

                            <p>
                                ${weather.visibility} m
                            </p>

                            <p>
                                ${weather.conditionDescription}
                            </p>

                            <hr/>

                            <small>
                                Güncelleme: ${new Date(weather.updated).toLocaleString("tr-TR")}
                            </small>

                        </div>

                    `).openPopup();

                });
            }

        }).addTo(map);

        map.fitBounds(cityLayer.getBounds());

    }
    catch (err) {

        console.error(
            "GeoJSON / Weather yüklenemedi",
            err
        );
    }
}