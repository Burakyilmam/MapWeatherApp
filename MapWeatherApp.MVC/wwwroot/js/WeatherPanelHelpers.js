export function GetWeatherTip(weather) {

    const temp = weather.temperature;

    if ((weather.rainVolume || 0) > 0) return "Şemsiye almayı unutmayın";
    if (weather.windSpeed * 3.6 >= 45) return "Şiddetli rüzgara karşı dikkatli olun";
    if (weather.visibility <= 2000) return "Görüş mesafesi çok düşük";
    if (weather.humidity >= 85) return "Yüksek nem bunaltıcı olabilir";
    if (weather.cloudiness >= 85) return "Gökyüzü tamamen kapalı";
    if (temp >= 40) return "Aşırı sıcaklara dikkat";
    if (temp >= 30) return "Güneş kremi kullanmalısınız";
    if (temp >= 25) return "Güzel bir gün sizi bekliyor";
    if (temp >= 20) return "Hava oldukça keyifli";
    if (temp >= 15) return "Hafif bir hırka yeterli olur";
    if (temp >= 10) return "İnce bir ceket alabilirsiniz";
    if (temp >= 5) return "Hava serin, mont önerilir";
    if (temp >= 0) return "Hava soğuk, sıkı giyinin";
    if (temp >= -10) return "Don tehlikesine dikkat";
    return "Buzlanmaya dikkat ediniz";
}


export function GetWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "K";
    if (deg < 67.5) return "KD";
    if (deg < 112.5) return "D";
    if (deg < 157.5) return "GD";
    if (deg < 202.5) return "G";
    if (deg < 247.5) return "GB";
    if (deg < 292.5) return "B";
    return "KB";
}


export function BuildWeatherTimeline(history, forecast, weather) {

    const timeline = [];


    // Geçmiş 5 gün
    history.forEach(day => {

        timeline.push({

            date: day.date,

            icon: day.icon,

            tempMin: day.tempMin,
            tempMax: day.tempMax,

            humidity: day.humidity,

            hasData: day.hasData,

            type: "history"

        });

    });


    // Bugün
    timeline.push({

        date: new Date(),

        icon: weather.conditionIcon,

        tempMin: weather.tempMin,
        tempMax: weather.tempMax,

        humidity: weather.humidity,

        hasData: true,

        type: "today"

    });


    // Gelecek 5 gün
    forecast.forEach(day => {

        timeline.push({

            date: day.date,

            icon: day.icon,

            tempMin: day.tempMin,
            tempMax: day.tempMax,

            humidity: 0,

            hasData: true,

            type: "forecast"

        });

    });


    return timeline;
}