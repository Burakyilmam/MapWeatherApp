import { GetMap } from "./Map.js";
import { GetCityLayer } from "./CityBorder.js";

export function FlyToCity(cityName) {

    const cityLayer = GetCityLayer();

    const map = GetMap();

    if (!cityLayer || !map) return;

    cityLayer.eachLayer(layer => {

        const layerCity =
            layer.feature.properties.name;

        if (
            layerCity
                .toLowerCase()
                .trim()
            ===
            cityName
                .toLowerCase()
                .trim()
        ) {

            const center =
                layer.getBounds().getCenter();

            map.flyTo(center, 7, {
                duration: 1.2
            });

            layer.fire("click");

            layer.setStyle({

                weight: 4,

                color: "#2196f3"
            });

            setTimeout(() => {

                layer.setStyle({

                    weight: 1,

                    color: "#555"
                });

            }, 2000);
        }
    });
}