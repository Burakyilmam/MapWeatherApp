export function GetPressureData(pressure) {

    const value = pressure || 1012;
    const percentage = Math.max(        0,        Math.min(1, (value - 960) / 100)    );
    const rotation = -90 + (percentage * 180);

    let status = "Normal";
    let statusClass = "normal";
    let color = "#ffffff";


    // 1 — Açık mavi
    if (value < 970) {

        status = "Düşük";
        statusClass = "low";
        color = "#81d4fa";

    }

    // 2 — Mavi
    else if (value < 980) {

        status = "Düşük";
        statusClass = "low";
        color = "#29b6f6";

    }

    // 3 — Açık yeşil
    else if (value < 990) {

        status = "Düşük";
        statusClass = "low";
        color = "#81c784";

    }

    // 4 — Yeşil
    else if (value < 1000) {

        status = "Düşük";
        statusClass = "low";
        color = "#4caf50";

    }

    // 5 — Beyaz
    else if (value < 1010) {

        status = "Normal";
        statusClass = "normal";
        color = "#ffffff";

    }

    // 6 — Sarı
    else if (value < 1020) {

        status = "Yüksek";
        statusClass = "high";
        color = "#ffeb3b";

    }

    // 7 — Koyu sarı
    else if (value < 1030) {

        status = "Yüksek";
        statusClass = "high";
        color = "#ffc107";

    }

    // 8 — Turuncu
    else if (value < 1040) {

        status = "Yüksek";
        statusClass = "high";
        color = "#ff9800";

    }

    // 9 — Koyu turuncu
    else if (value < 1050) {

        status = "Yüksek";
        statusClass = "high";
        color = "#ff5722";

    }

    // 10 — Kırmızı
    else if (value < 1060) {

        status = "Yüksek";
        statusClass = "high";
        color = "#f44336";

    }

    // 11 — Koyu kırmızı
    else {

        status = "Yüksek";
        statusClass = "high";
        color = "#b71c1c";

    }

    return {
        value,
        percentage,
        rotation,
        status,
        statusClass,
        color
    };
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

    let progress = 0;
    let icon = "🌥️";
    let color = "#fff3a6";
    let isNight = false;

    if (currentMin >= sunriseMin && currentMin <= sunsetMin) {

        progress = (currentMin - sunriseMin) / (sunsetMin - sunriseMin);

        x = 5 + (90 * progress);
        y = 32 - (44 * progress * (1 - progress));

        if (progress < 0.15) {
            icon = "🌥️";
            color = "#fff3a6";
        }
        else if (progress < 0.40) {
            icon = "☀️";
            color = "#ffeb3b";
        }
        else if (progress < 0.65) {
            icon = "☀️";
            color = "#ffd54f";
        }
        else if (progress < 0.85) {
            icon = "🟠";
            color = "#ff9800";
        }
        else {
            icon = "🔴";
            color = "#e65100";
        }

    }
    else {

        x = 95;
        y = 32;

        progress = 1;
        icon = "🌙";
        color = "#b0bec5";
        isNight = true;
    }

    return {
        x,
        y,
        progress,
        icon,
        color,
        isNight
    };
}