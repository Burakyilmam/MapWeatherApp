import { SetupPanelSliders } from "./PanelSlider.js";

let cityInfoPanel = null;

export async function OpenCityInfoPanel(cityName) {

    try {
        const response = await fetch(`/data/${cityName}.json`);

        if (!response.ok) {
            console.error(`${cityName} şehir verisi yüklenemedi.`);
            return;
        }

        const city = await response.json();

        console.log("Şehir JSON verisi:", city);

        if (!cityInfoPanel) {

            cityInfoPanel = document.createElement("div");
            cityInfoPanel.id = "cityInfoPanel";
            cityInfoPanel.className = "wp-city-info-panel";
            document.body.appendChild(cityInfoPanel);
        }

        const hero = city.hero || {};
        const facts = city.facts || {};

        const factIcons = {
            plateCode: "🚘",
            postalCode: "📮",
            population: "👥",
            populationRank: "🏆",
            districtCount: "⌖",
            populationDensity: "📊",
            region: "🌍",
            area: "📐",
            altitude: "⛰️",
            mainSectors: "🏭",
            mainAgriculturalProducts: "🌾",
            highestPoint: "🏔️"
        };

        const factLabels = {

            plateCode: "Plaka Kodu",
            postalCode: "Posta Kodu",
            population: "Nüfus",
            populationRank: "Nüfus Sıralaması",
            districtCount: "İlçe Sayısı",
            populationDensity: "Nüfus Yoğunluğu",
            region: "Coğrafi Bölge",
            area: "Yüzölçümü",
            altitude: "Rakım",
            mainSectors: "Öne Çıkan Sektör",
            mainAgriculturalProducts: "Öne Çıkan Tarım Ürünleri",
            highestPoint: "En Yüksek Nokta"
        };

        const factsHTML =
            Object.entries(facts)
                .map(([key, value]) => {

                    return `

                        <div class="wp-city-info-fact">

                            <span class="fact-icon">
                                ${factIcons[key] || "•"}
                            </span>

                            <div>

                                <small>
                                    ${factLabels[key] || key}
                                </small>

                                <strong>
                                    ${value}
                                </strong>

                            </div>

                        </div>

                    `;

                })
                .join("");

        const districts = Array.isArray(city.districts) ? city.districts : [];
        const districtsHTML = districts.map(district => {
            return `
        <article class="wp-city-district-card">

            <a
                href="${district.wiki || "#"}"
                ${district.wiki ? 'target="_blank" rel="noopener noreferrer"' : ""}
                class="wp-city-card-link">

                <div class="wp-city-district-image">
                    <img
                        src="${district.image}"
                        alt="${district.name}"
                        loading="lazy"
                    >
                </div>

                <div class="wp-city-district-content">

                    <h4>
                        ${district.name}
                    </h4>

                    <small>
                         ${district.population || "N/A"}
                    </small>

                </div>

            </a>

        </article>
    `;
        }).join("");

        const places = Array.isArray(city.places) ? city.places : [];
        const placesHTML = places.map(place => {
            return `

                      <article class="wp-city-place-card">
                    
                        <a
                            href="${place.wiki || "#"}"
                            ${place.wiki ? 'target="_blank" rel="noopener noreferrer"' : ""}
                            class="wp-city-card-link">
                    
                            <div class="wp-city-place-image">
                                <img
                                    src="${place.image}"
                                    alt="${place.name}"
                                    loading="lazy"
                                >
                            </div>
                    
                            <div class="wp-city-place-content">
                                <h4>
                                    ${place.name}
                                </h4>
                            </div>
                    
                        </a>
                    
                    </article>

                    `;

        })
            .join("");

        const foods = Array.isArray(city.foods) ? city.foods : [];
        const foodsHTML = foods.map(food => {

            return `

                        <article class="wp-city-food-card">

                            <a
                                href="${food.wiki || "#"}"
                                ${food.wiki ? 'target="_blank" rel="noopener noreferrer"' : ""}
                                class="wp-city-card-link">
                        
                                <div class="wp-city-food-image">
                                    <img
                                        src="${food.image}"
                                        alt="${food.name}"
                                        loading="lazy"
                                    >
                                </div>
                        
                                <h4>
                                    ${food.name}
                                </h4>
                        
                            </a>
                        
                        </article>

                    `;

        })
            .join("");


        const history = Array.isArray(city.history) ? city.history : [];
        const historyHTML = history.map(item => {

            return `

                        <div
                            class="wp-city-timeline-item">

                            <span
                                class="timeline-dot">
                            </span>

                            <div>

                                <strong>
                                    ${item.date}
                                </strong>

                                <p>
                                    ${item.title}
                                </p>

                            </div>

                        </div>

                    `;

        })
            .join("");

        const people = Array.isArray(city.people) ? city.people : [];
        const peopleHTML = people.map(person => {

            return `
        <article
            class="wp-city-person-card">

            <a
                href="${person.wiki || "#"}"
                ${person.wiki ? 'target="_blank" rel="noopener noreferrer"' : ""}
                class="wp-city-person-link">

                <img
                    src="${person.image}"
                    alt="${person.name}"
                    loading="lazy"
                >

                <h4>
                    ${person.name}
                </h4>

                <small>
                    ${person.role || ""}
                </small>

            </a>

        </article>
    `;

        }).join("");

        cityInfoPanel.innerHTML = `
            <div class="wp-city-info-header">

                <button
                    type="button"
                    class="wp-city-info-close"
                    aria-label="Paneli kapat">

                    ✕

                </button>

            </div>

            <div class="wp-city-info-content">

                <section
                    class="wp-city-section wp-city-info-hero">


                    <div class="wp-city-info-intro">

                        <div
                            class="wp-city-info-image-section">

                            <img
                                class="wp-city-info-intro-image"
                                src="${hero.image || ""}"
                                alt="${city.name}"
                            >

                            <div
                                class="wp-city-info-intro-overlay">

                                ${city.wiki
                                                ? `
                                        <a
                                            href="${city.wiki}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="wp-city-name">
                                            ${(city.name || cityName).toUpperCase()}
                                        </a>
                                    `
                                                : `
                                        <h2>
                                            ${(city.name || cityName).toUpperCase()}
                                        </h2>
                                    `
                                }

                                <h3>
                                    ${hero.title || ""}
                                </h3>

                                <p>
                                    ${hero.description || ""}
                                </p>

                            </div>

                        </div>

                        <div class="wp-city-info-facts">


                            <div
                                class="wp-city-info-facts-title">

                                <span>
                                    ▣
                                </span>

                                <strong>
                                    ŞEHİR BİLGİLERİ
                                </strong>

                            </div>


                            <div
                                class="wp-city-info-facts-grid">

                                ${factsHTML}

                            </div>


                        </div>

                    </div>

                </section>

               <section
                class="wp-city-section wp-city-districts-section">
            
                <div class="wp-city-section-header">
            
                    <div class="wp-city-section-title">
            
                        <span>
                            🏘️
                        </span>
            
                        <h3>
                            İLÇELER
                        </h3>
            
                    </div>
            
                </div>
            
                <div class="wp-city-districts-slider">
            
                    <button
                        type="button"
                        class="wp-city-districts-prev"
                        aria-label="Önceki ilçe">
                        ‹
                    </button>
            
                    <div class="wp-city-district-list">
                        ${districtsHTML}
                    </div>
            
                    <button
                        type="button"
                        class="wp-city-districts-next"
                        aria-label="Sonraki ilçe">
                        ›
                    </button>
            
                </div>
            
            </section>

                <section
                    class="wp-city-section wp-city-places-section">


                    <div
                        class="wp-city-section-header">

                        <div
                            class="wp-city-section-title">

                            <span>
                                ⌖
                            </span>

                            <h3>
                                GEZİLECEK YERLER
                            </h3>

                        </div>

                    </div>


                    <div class="wp-city-places-slider">
                    
                        <button
                            type="button"
                            class="wp-city-places-prev"
                            aria-label="Önceki yer">
                            ‹
                        </button>
                    
                        <div class="wp-city-place-list">
                            ${placesHTML}
                        </div>
                    
                        <button
                            type="button"
                            class="wp-city-places-next"
                            aria-label="Sonraki yer">
                            ›
                        </button>
                    
                    </div>

                </section>

                <section
                    class="wp-city-section wp-city-food-section">


                    <div
                        class="wp-city-section-header">

                        <div
                            class="wp-city-section-title">

                            <span>
                                🍴
                            </span>

                            <h3>
                                NELER YENİR
                            </h3>

                        </div>

                    </div>


                <div class="wp-city-foods-slider">
                
                    <button
                        type="button"
                        class="wp-city-foods-prev"
                        aria-label="Önceki yemek">
                        ‹
                    </button>
                
                    <div class="wp-city-food-list">
                        ${foodsHTML}
                    </div>
                
                    <button
                        type="button"
                        class="wp-city-foods-next"
                        aria-label="Sonraki yemek">
                        ›
                    </button>
                
                </div>

                </section>

                <section
                    class="wp-city-section wp-city-history-section">


                    <div
                        class="wp-city-section-header">

                        <div
                            class="wp-city-section-title">

                            <span>
                                ⌛
                            </span>

                            <h3>
                                ÖNEMLİ OLAYLAR VE TARİH
                            </h3>

                        </div>

                    </div>


                    <div
                        class="wp-city-timeline">

                        ${historyHTML}

                    </div>

                </section>

                <section
                    class="wp-city-section wp-city-people-section">


                    <div
                        class="wp-city-section-header">

                        <div
                            class="wp-city-section-title">

                            <span>
                                ♙
                            </span>

                            <h3>
                                ÖNEMLİ KİŞİLER
                            </h3>

                        </div>

                    </div>


                    <div class="wp-city-people-slider">
                    
                        <button
                            type="button"
                            class="wp-city-people-prev"
                            aria-label="Önceki kişiler">
                            ‹
                        </button>
                    
                        <div class="wp-city-people-list">
                            ${peopleHTML}
                        </div>
                    
                        <button
                            type="button"
                            class="wp-city-people-next"
                            aria-label="Sonraki kişiler">
                            ›
                        </button>
                    
                    </div>

                </section>

            </div>
        `;

        cityInfoPanel.classList.add("open");

        SetupPanelSliders(cityInfoPanel);

        const closeButton = cityInfoPanel.querySelector(".wp-city-info-close");

        if (closeButton) {

            closeButton.addEventListener("click", CloseCityInfoPanel);
        }


    }
    catch (error) {

        console.error(`${cityName} şehir paneli oluşturulurken hata oluştu:`, error);

    }

}

export function CloseCityInfoPanel() {

    if (!cityInfoPanel) {
        return;
    }

    cityInfoPanel.classList.remove("open");
}