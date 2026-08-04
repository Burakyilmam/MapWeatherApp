import { cities } from "./Cities.js";

let cityAudio = null;
let audioProgressAnimation = null;

export function StartCityMusic(cityName) {

    StopCityMusic();

    const city = cities[cityName];

    if (!city?.music)
        return;

    const progress = document.querySelector(".wp-city-music-progress");
    const progressFill = document.querySelector(".wp-city-music-progress-fill");
    const card =  document.querySelector(".wp-left-card");

    if (!progress || !progressFill || !card) return;

    cityAudio = new Audio(city.music);
    cityAudio.volume = 0.35;
    cityAudio.loop = true;

    function UpdateProgress() {

        if (
            cityAudio &&
            Number.isFinite(cityAudio.duration) &&
            cityAudio.duration > 0
        ) {

            const percentage =
                (cityAudio.currentTime / cityAudio.duration) * 100;

            progressFill.style.width =
                `${percentage}%`;
        }

        audioProgressAnimation =
            requestAnimationFrame(UpdateProgress);

    }
    

    progress.addEventListener("click", (e) => {

        e.stopPropagation();

        if (
            !cityAudio ||
            !Number.isFinite(cityAudio.duration)
        )
            return;

        const rect =
            progress.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const percentage =
            Math.max(0, Math.min(1, x / rect.width));

        cityAudio.currentTime =
            percentage * cityAudio.duration;
    });

    card.addEventListener("click", (e) => {

        if (
            e.target.closest(".wp-city-slider-arrow") ||
            e.target.closest(".wp-city-slider-dot") ||
            e.target.closest(".wp-city-image-title") ||
            e.target.closest(".wp-city-name") ||
            e.target.closest(".wp-city-music-progress")
        ) {
            return;
        }

        if (!cityAudio)
            return;

        if (cityAudio.paused) {

            cityAudio.play().catch(err => {
                console.log("Audio:", err);
            });

        }
        else {

            cityAudio.pause();
        }
    });

    cityAudio.play().catch(err => {

        console.log(
            "Tarayıcı otomatik oynatmayı engelledi:",
            err
        );

    });

    UpdateProgress();
}


export function StopCityMusic() {

    if (audioProgressAnimation) {

        cancelAnimationFrame(audioProgressAnimation);

        audioProgressAnimation = null;
    }

    if (cityAudio) {

        cityAudio.pause();

        cityAudio.currentTime = 0;

        cityAudio = null;
    }
}