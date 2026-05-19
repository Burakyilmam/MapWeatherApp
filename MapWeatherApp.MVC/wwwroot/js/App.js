import { CreateMap } from './Map.js';
import { TurkeyGeoJsonDatas } from './CityBorder.js';
import { AddLegend } from './Legend.js';
import { AddMapMode } from './MapMode.js';
import { AddCitySearch } from './Search.js';
import { AddDailyLeaderPanel } from './DailyLeader.js';

document.addEventListener("DOMContentLoaded", async function () {

    CreateMap(39.0, 35.0, 4, 18);
    await TurkeyGeoJsonDatas();
    AddLegend();
    AddMapMode();
    AddCitySearch();
    AddDailyLeaderPanel();
});