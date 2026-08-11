export function SetupPanelSliders(panel) {

    if (!panel) return;


    const sliders = [
        {
            list: ".wp-city-place-list",
            prev: ".wp-city-places-prev",
            next: ".wp-city-places-next"
        },
        {
            list: ".wp-city-food-list",
            prev: ".wp-city-foods-prev",
            next: ".wp-city-foods-next"
        },
        {
            list: ".wp-city-people-list",
            prev: ".wp-city-people-prev",
            next: ".wp-city-people-next"
        },
        {
            list: ".wp-city-district-list",
            prev: ".wp-city-districts-prev",
            next: ".wp-city-districts-next"
        }
    ];


    sliders.forEach(slider => {

        const list = panel.querySelector(slider.list);
        const prevButton = panel.querySelector(slider.prev);
        const nextButton = panel.querySelector(slider.next);

        if (!list) return;

        const GetScrollAmount = () => {

            const card = list.firstElementChild;

            if (!card) return 0;


            const style = getComputedStyle(list);
            const gap = parseFloat(style.columnGap) || 0;


            return (card.offsetWidth + gap) * 3;
        };


        prevButton?.addEventListener("click",
            (event) => {

                event.stopPropagation();

                list.scrollBy({
                    left: -GetScrollAmount(),
                    behavior: "smooth"
                });

            }
        );


        nextButton?.addEventListener("click",
            (event) => {

                event.stopPropagation();

                list.scrollBy({
                    left: GetScrollAmount(),
                    behavior: "smooth"
                });

            }
        );

    });

}