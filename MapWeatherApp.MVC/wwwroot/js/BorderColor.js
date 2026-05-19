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

export function GetColorByHumidity(humidity) {
    if (humidity <= 20) return '#A04000';
    if (humidity <= 40) return '#D35400';
    if (humidity <= 60) return '#E67E22';
    if (humidity <= 80) return '#F1C40F';
    return '#2ECC71';
}

export function GetColorBySnow(snow) {
    if (snow <= 0) return '#CFD8DC';
    if (snow <= 1) return '#A0C4FF';
    if (snow <= 3) return '#B9D5FF';
    if (snow <= 7) return '#D0E7FF';
    return '#F8F9FA';
}

export function GetColorByCloud(cloudiness) {
    if (cloudiness < 10) return '#FFFFFF';
    if (cloudiness < 30) return '#E5E7E9';
    if (cloudiness < 50) return '#B2BABB';
    if (cloudiness < 70) return '#717D7E';
    return '#34495E';
}

export function GetColorByVisibility(visibility) {
    if (visibility < 1000) return '#546E7A';
    if (visibility < 3000) return '#90A4AE';
    if (visibility < 5000) return '#CFD8DC';
    if (visibility < 8000) return '#90CAF9';
    return '#42A5F5';
}

export function GetColorByPressure(pressure) {
    // < 990 hPa: Çok Alçak Basınç (Görselin en solundaki o derin, koyu okyanus mavisi)
    if (pressure < 990)
        return '#006699';

    // < 1000 hPa: Alçak Basınç (Görseldeki o canlı, tatlı turkuaz tonu)
    if (pressure < 1000)
        return '#009999';

    // < 1010 hPa: Normal Basınç / Dengeli (Tam ortadaki o mat, hafif yeşilimsi soft geçiş rengi)
    if (pressure < 1010)
        return '#7DA49A';

    // < 1020 hPa: Yüksek Basınç (Sağa doğru geçen o tatlı taba / açık kahve-turuncu tonu)
    if (pressure < 1020)
        return '#B37D4A';

    // 1020 hPa ve üzeri: Çok Yüksek Basınç (En sağdaki o yoğun, tok kiremit / yanık turuncu tonu)
    return '#A65526';
}