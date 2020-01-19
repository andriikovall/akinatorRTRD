const playerElement = document.getElementById('player');

function displayPlayer() {
    player.style.display = 'block';
}

function hidePlayer() {
    player.style.display = 'none';
}

function getSongUrlById(songId) {
    const url = new URL(playerElement.getAttribute('src'));
    const query = url.searchParams;
    query.set('id', songId);
    url.searchParams = query;
    return url;
}

function setSongById(songId) {
    playerElement.setAttribute('src', getSongUrlById(songId)); 
}

