let currentAudio = null;

const sounds = {

    // ☀️ Açık
    "01d": "/sounds/sunny.mp3",
    "01n": "/sounds/sunny.mp3",

    // 🌤️ Az bulutlu
    "02d": "/sounds/sunny.mp3",
    "02n": "/sounds/sunny.mp3",

    // ☁️ Bulutlu
    "03d": "/sounds/clouds.mp3",
    "03n": "/sounds/clouds.mp3",

    // ☁️ Kapalı
    "04d": "/sounds/clouds.mp3",
    "04n": "/sounds/clouds.mp3",

    // 🌧️ Sağanak
    "09d": "/sounds/rain.mp3",
    "09n": "/sounds/rain.mp3",

    // 🌧️ Yağmur
    "10d": "/sounds/rain.mp3",
    "10n": "/sounds/rain.mp3",

    // ⛈️ Fırtına
    "11d": "/sounds/thunderstorm.mp3",
    "11n": "/sounds/thunderstorm.mp3",

    // ❄️ Kar
    "13d": "/sounds/snow.mp3",
    "13n": "/sounds/snow.mp3",

    // 🌫️ Sis
    "50d": "/sounds/wind.mp3",
    "50n": "/sounds/wind.mp3"
};

export function StartWeatherEffect(weather) {

    const audioPath = sounds[weather.conditionIcon];

    if (!audioPath) return;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioPath);
    currentAudio.loop = true;
    currentAudio.volume = 0.40;

    currentAudio.play().catch(err => {
        console.log("Audio:", err);
    });
}

export function StopWeatherEffect() {

    if (!currentAudio) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
}