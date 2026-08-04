import { cities } from "./Cities.js";

const SLIDE_DURATION = 5000;

let citySliderInterval = null;
let citySlideIndex = 0;

export function StartCitySlider(cityName) {

    StopCitySlider();

    const city = cities[cityName];

    if (!city?.images?.length) return;

    const images = city.images;

    const card = document.querySelector(".wp-left-card");
    const title = document.querySelector(".wp-city-image-title");
    const dotsContainer = document.querySelector(".wp-city-slider-dots");
    const prevButton = document.querySelector(".wp-city-slider-prev");
    const nextButton = document.querySelector(".wp-city-slider-next");

    if (!card || !title || !dotsContainer) return;

    citySlideIndex = 0;

    dotsContainer.innerHTML = images
        .map((_, index) => `
            <button
                type="button"
                class="wp-city-slider-dot ${index === 0 ? "active" : ""}"
                data-index="${index}">
            </button>
        `)
        .join("");

    const dots = dotsContainer.querySelectorAll(".wp-city-slider-dot");

    function ShowSlide(index) {

        citySlideIndex = index;

        const image = images[citySlideIndex];

        card.style.backgroundImage = `
            linear-gradient(
                rgba(8, 12, 25, 0.40),
                rgba(8, 12, 25, 0.78)
            ),
            url("${image.src}")
        `;

        title.textContent = `📍 ${image.title}`;

        if (image.wiki) {

            title.href = image.wiki;
            title.style.display = "inline-flex";

        }
        else {

            title.removeAttribute("href");
            title.style.display = "none";
        }

        dots.forEach((dot, dotIndex) => {

            dot.classList.toggle("active",dotIndex === citySlideIndex);

        });
    }


    function NextSlide() {

        const nextIndex = (citySlideIndex + 1) % images.length;

        ShowSlide(nextIndex);
    }


    function PreviousSlide() {

        const previousIndex =
            (citySlideIndex - 1 + images.length) % images.length;

        ShowSlide(previousIndex);
    }


    function StopAutoSlide() {

        if (!citySliderInterval) return;

        clearInterval(citySliderInterval);

        citySliderInterval = null;
    }


    function StartAutoSlide() {

        StopAutoSlide();

        citySliderInterval = setInterval(() => {

            NextSlide();

        }, SLIDE_DURATION);
    }


    function RestartAutoSlide() {

        StartAutoSlide();
    }


    prevButton?.addEventListener("click", (e) => {

        e.stopPropagation();

        PreviousSlide();
        RestartAutoSlide();
    });


    nextButton?.addEventListener("click", (e) => {

        e.stopPropagation();

        NextSlide();
        RestartAutoSlide();
    });


    dots.forEach(dot => {

        dot.addEventListener("click", (e) => {

            e.stopPropagation();

            const index = Number(dot.dataset.index);

            ShowSlide(index);
            RestartAutoSlide();
        });

    });


    ShowSlide(0);
    StartAutoSlide();
}

export function StopCitySlider() {

    if (citySliderInterval) {

        clearInterval(citySliderInterval);

        citySliderInterval = null;
    }
}