import { GetMap } from "./Map.js";
import { GetColorByTemperature }
    from "./BorderColor.js";

let cityLayer = null;

export function GetCityLayer() {
    return cityLayer;
}


export async function TurkeyGeoJsonDatas() {

    const map = GetMap();

    if (!map) return;

    const weatherResponse =
        await fetch(
            "https://localhost:7271/api/weather/latest"
        );

    const weatherData = await weatherResponse.json();

    const geoResponse =
        await fetch(
            "https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json"
        );

    const geoData = await geoResponse.json();

    if (cityLayer) {
        map.removeLayer(cityLayer);
    }

    cityLayer =
        L.geoJSON(geoData, {

            style: () => ({
                color: "#555",
                weight: 1,
                fillOpacity: 0.7
            }),

            onEachFeature:
                function (feature, layer) {

                    const cityName = feature.properties.name;

                    const weather = weatherData.find(x => x.city === cityName);

                    if (!weather) return;

                    layer._weatherData = weather;

                    layer.setStyle({

                        fillColor:
                            GetColorByTemperature(weather.temperature)
                    });

                    layer.bindTooltip(`

                    <div>

                        <b>
                            ${weather.city}
                        </b>

                        <br/>

                        🌡️
                        ${weather.temperature} °C

                    </div>

                `);
                }

        }).addTo(map);

    if (!window.mapInitialized) {

        map.fitBounds(cityLayer.getBounds());

        window.mapInitialized = true;
    }
}