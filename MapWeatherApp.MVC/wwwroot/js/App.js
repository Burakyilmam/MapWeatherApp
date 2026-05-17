import { CreateMap } from './Map.js';
import { TurkeyGeoJsonDatas } from './CityBorder.js';

document.addEventListener("DOMContentLoaded", function () {

    CreateMap(39.0, 35.0, 4, 18);
    TurkeyGeoJsonDatas();
});