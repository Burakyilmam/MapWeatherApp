let currentMapMode = "temperature";

export function GetMapMode() {
    return currentMapMode;
}

export function SetMapMode(mode) {
    currentMapMode = mode;
}