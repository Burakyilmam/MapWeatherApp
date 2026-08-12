export function GetPressureData(pressure) {

    const value = pressure || 1012;
    const percentage = Math.max(0, Math.min(1, (value - 960) / 100));
    const rotation = -90 + (percentage * 180);

    let status = "Normal";
    let statusClass = "normal";

    if (value < 1000) {
        status = "Düşük";
        statusClass = "low";
    }
    else if (value > 1020) {
        status = "Yüksek";
        statusClass = "high";
    }

    return { value, percentage, rotation, status, statusClass };
}

export function GetSunPosition(sunrise, sunset) {

    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);
    const now = new Date();

    const sunriseMin = sunriseDate.getHours() * 60 + sunriseDate.getMinutes();
    const sunsetMin = sunsetDate.getHours() * 60 + sunsetDate.getMinutes();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    let x = 5;
    let y = 32;

    if (currentMin >= sunriseMin && currentMin <= sunsetMin) {

        const percentage = (currentMin - sunriseMin) / (sunsetMin - sunriseMin);

        x = 5 + (90 * percentage);
        y = 32 - (60 * percentage * (1 - percentage));
    }
    else if (currentMin > sunsetMin) {
        x = 95;
    }

    return { x, y };
}