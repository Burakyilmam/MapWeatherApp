const WEATHER_API = "https://localhost:7271/api/Weather";

export async function GetWeatherHistory(city) {

    const response = await fetch(`${WEATHER_API}/${city}/history`);

    if (!response.ok) {
        throw new Error("Hava durumu geçmişi alınamadı");
    }

    return await response.json();
}

export async function GetWeatherForecast(city) {

    const response = await fetch(`${WEATHER_API}/${city}/forecast`);

    if (!response.ok) {
        throw new Error("Hava durumu tahmini alınamadı");
    }

    return await response.json();
}