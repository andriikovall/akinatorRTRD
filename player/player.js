let songs = [];

function insertSong(song) {
    songs.push(song)
}

function clearSongs() {
    songs.length = 0;
}   

function getPlayerForSongById(id) {
    const songIndex = songs.findIndex(s => s.id === id);
    if (songIndex < 0)
        return null;

    return `<iframe scrolling="no" frameborder="0" allowTransparency="true" id="player-${songIndex}"
        src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=tracks&id=${id}&app_id=1"
        width="300" height="300"></iframe>`;
}
