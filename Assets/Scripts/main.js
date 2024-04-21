import Game from "./Engine/Game.js";
const config = {
    container : `body`,
    tile:32,
    aspect:1,
    framerate:1/5,
    ignoreSpritesheet : true,
    width : parseInt(window.innerWidth)*.92,
    height : parseInt(window.innerHeight)*.92
}
document.addEventListener('DOMContentLoaded', function () {
    if(window.game) return;
    window.game = new Game(config);
}, false);