import { cities } from "./Cities.js";

let cityAudio = null;
let audioProgressAnimation = null;

let currentVolume = 0.35;
let previousVolume = 0.35;

let keydownHandler = null;
let wheelHandler = null;


export function StartCityMusic(cityName) {

    StopCityMusic();

    const city = cities[cityName];

    if (!city?.music) return;

    const progress = document.querySelector(".wp-city-music-progress");
    const progressFill = document.querySelector(".wp-city-music-progress-fill");
    const muteButton = document.querySelector(".wp-city-music-mute");
    const card = document.querySelector(".wp-left-card");

    if (!progress || !progressFill || !muteButton || !card) return;

    cityAudio = new Audio(city.music);
    cityAudio.volume = currentVolume;
    cityAudio.loop = true;

    function UpdateVolumeIcon() {

        if (!cityAudio) return;

        if (cityAudio.muted || cityAudio.volume === 0) {

            muteButton.textContent = "🔇";
            muteButton.title = "Sesi aç";

        }
        else if (cityAudio.volume < 0.4) {

            muteButton.textContent = "🔈";
            muteButton.title = "Sesi kapat";

        }
        else if (cityAudio.volume < 0.7) {

            muteButton.textContent = "🔉";
            muteButton.title = "Sesi kapat";

        }
        else {

            muteButton.textContent = "🔊";
            muteButton.title = "Sesi kapat";
        }
    }

    function UpdateProgress() {

        if (cityAudio && Number.isFinite(cityAudio.duration) && cityAudio.duration > 0) {

            const percentage = (cityAudio.currentTime / cityAudio.duration) * 100;
            progressFill.style.width = `${percentage}%`;
        }

        audioProgressAnimation = requestAnimationFrame(UpdateProgress);
    }


    progress.addEventListener("click", (e) => {

        e.stopPropagation();

        if (!cityAudio || !Number.isFinite(cityAudio.duration)) return;

        const rect = progress.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));

        cityAudio.currentTime = percentage * cityAudio.duration;
    });


    muteButton.addEventListener("click", (e) => {

        e.stopPropagation();

        if (!cityAudio) return;

        if (cityAudio.muted || cityAudio.volume === 0) {

            cityAudio.muted = false;

            currentVolume = previousVolume > 0 ? previousVolume : 0.35;

            cityAudio.volume = currentVolume;

        }
        else {

            previousVolume = cityAudio.volume;
            cityAudio.muted = true;
        }

        UpdateVolumeIcon();
    });

    keydownHandler = (e) => {

        const target = e.target;

        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement || target?.isContentEditable) {
            return;
        }

        if (!cityAudio) return;

        if (e.code === "Space") {

            e.preventDefault();

            if (cityAudio.paused) {

                cityAudio.play().catch(err => {
                    console.log("Audio:", err);
                });

            }
            else {
                cityAudio.pause();
            }

            return;
        }

        if (e.code === "ArrowLeft") {

            e.preventDefault();

            cityAudio.currentTime = Math.max(0, cityAudio.currentTime - 5);

            return;
        }


        if (e.code === "ArrowRight") {

            e.preventDefault();

            if (!Number.isFinite(cityAudio.duration)) return;

            cityAudio.currentTime = Math.min(cityAudio.duration, cityAudio.currentTime + 5);
        }

        if (e.code === "ArrowUp") {

            e.preventDefault();

            const newVolume = Math.min(1, cityAudio.volume + 0.05);

            cityAudio.muted = false;
            cityAudio.volume = newVolume;

            currentVolume = newVolume;

            if (newVolume > 0) {
                previousVolume = newVolume;
            }

            UpdateVolumeIcon();

            return;
        }

        if (e.code === "ArrowDown") {

            e.preventDefault();

            const newVolume = Math.max(0, cityAudio.volume - 0.05);

            cityAudio.muted = false;
            cityAudio.volume = newVolume;

            currentVolume = newVolume;

            if (newVolume > 0) {
                previousVolume = newVolume;
            }

            UpdateVolumeIcon();

            return;
        }

        if (e.key >= "0" && e.key <= "9") {

            if (!Number.isFinite(cityAudio.duration) || cityAudio.duration <= 0) {
                return;
            }

            e.preventDefault();

            const number = Number(e.key);

            const percentage = number / 10;

            cityAudio.currentTime = cityAudio.duration * percentage;

            return;
        }

        if (e.code === "KeyM" && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();

            if (cityAudio.muted || cityAudio.volume === 0) {

                cityAudio.muted = false;

                currentVolume = previousVolume > 0 ? previousVolume : 0.35;

                cityAudio.volume = currentVolume;
            }
            else {

                previousVolume = cityAudio.volume;

                cityAudio.muted = true;
            }

            UpdateVolumeIcon();

            return;
        }
    };

    document.addEventListener("keydown", keydownHandler);


    wheelHandler = (e) => {

        if (!cityAudio) return;

        e.preventDefault();
        e.stopPropagation();

        const step = 0.05;

        if (e.deltaY < 0) {

            currentVolume = Math.min(1, cityAudio.volume + step);

        }
        else {

            currentVolume = Math.max(0, cityAudio.volume - step);
        }

        cityAudio.muted = false;
        cityAudio.volume = currentVolume;

        if (currentVolume > 0) {
            previousVolume = currentVolume;
        }

        UpdateVolumeIcon();
    };

    card.addEventListener("wheel", wheelHandler, { passive: false });

    card.addEventListener("click", (e) => {

        if (
            e.target.closest(".wp-city-slider-arrow") ||
            e.target.closest(".wp-city-slider-dot") ||
            e.target.closest(".wp-city-image-title") ||
            e.target.closest(".wp-city-name") ||
            e.target.closest(".wp-city-music-controls")
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

    UpdateVolumeIcon();

    cityAudio.play().catch(err => {

        console.log("Tarayıcı otomatik oynatmayı engelledi:", err);

    });

    UpdateProgress();
}


export function StopCityMusic() {

    if (audioProgressAnimation) {

        cancelAnimationFrame(audioProgressAnimation);

        audioProgressAnimation = null;
    }


    if (keydownHandler) {

        document.removeEventListener("keydown", keydownHandler);

        keydownHandler = null;
    }


    const card =
        document.querySelector(".wp-left-card");

    if (card && wheelHandler) {

        card.removeEventListener("wheel", wheelHandler);

        wheelHandler = null;
    }


    if (cityAudio) {

        if (!cityAudio.muted && cityAudio.volume > 0) {
            currentVolume = cityAudio.volume;
        }

        cityAudio.pause();
        cityAudio.currentTime = 0;

        cityAudio = null;
    }
}