function createSongPlayerByDeezId(id, size = 270) {
    return `<iframe scrolling="no" frameborder="0" allowTransparency="true" id="${id}"
        src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=tracks&id=${id}&app_id=1"
        width="${size}" height="${size}"></iframe>`;
}