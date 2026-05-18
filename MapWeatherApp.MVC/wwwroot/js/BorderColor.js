import { GetMap } from './Map.js';

export function GetColorByTemperature(temperature) {
    if (temperature < -50) return '#4a148c';
    if (temperature < -40) return '#7b1fa2';
    if (temperature < -30) return '#651fff';
    if (temperature < -20) return '#1565c0';
    if (temperature < -10) return '#1e88e5';
    if (temperature < 0) return '#64b5f6';
    if (temperature < 10) return '#4caf50';
    if (temperature < 20) return '#fdd835';
    if (temperature < 30) return '#ffb74d';
    if (temperature < 40) return '#ff7043';
    if (temperature < 50) return '#e53935';
    return '#b71c1c';
}

export function GetColorByWind(wind) {
    if (wind < 5) return "#a5d6a7";
    if (wind < 15) return "#4caf50";
    if (wind < 25) return "#fbc02d";
    if (wind < 40) return "#fb8c00";

    return "#c62828";
}

export function GetColorByRain(rain) {
    if (rain <= 0) return "#bdbdbd";
    if (rain < 2) return "#90caf9";
    if (rain < 5) return "#42a5f5";
    if (rain < 15) return "#1565c0";

    return "#0d47a1";
}