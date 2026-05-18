import { GetMap } from './map.js';
export function MakeDraggablePopup(popup) {

    const map = GetMap();
    if (!map) return;

    const container = popup.getElement();
    if (!container) return;

    const draggable = new L.Draggable(container);
    draggable.enable();

    draggable.on('dragend', function () {

        const point = L.DomUtil.getPosition(container);
        const latlng = map.layerPointToLatLng(point);

        popup.setLatLng(latlng);
    });
}

export function MakeDraggableControl(div) {

    const draggable = new L.Draggable(div);
    draggable.enable();

    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    draggable.on('dragstart', function () {
        div.classList.add('dragging');
    });

    draggable.on('dragend', function () {
        div.classList.remove('dragging');
    });
}