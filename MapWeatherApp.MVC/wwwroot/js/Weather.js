let weatherData = [];

export async function LoadWeatherData() {

    const response = await fetch("https://localhost:7271/api/weather/latest");

    if (!response.ok) {
        throw new Error("Weather verisi alınamadı");
    }

    weatherData = await response.json();

    return weatherData;
}

export function GetWeatherData() {
    return weatherData;
}