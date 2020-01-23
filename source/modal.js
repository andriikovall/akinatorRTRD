function openModalForSong({ title, artistName, deezer: { id, link } }) {
    if (id && link) {
        openModal({ title, artist: { name: artistName }, id, link });
    } else {
        getDetailedSongInfo(title, artistName) 
            .then(openModal);
    }

    function openModal({ title, artist: { name }, id, link }) {
        if (arguments[0] == null) {
            //todo smth with null song
        }
        $('#resultModal').modal({backdrop: 'static',keyboard: false}); // hardcoded modal id
        $('.modal-body #player').html(createSongPlayerByDeezId(id));
        $('#title').html(title || '--');
        $('#author').html(name || '--');
        $('#link').attr("href", link);
        // todo more fields probably
    }
}


function getDetailedSongInfo(title, artistName) {
    const url = new URL('https://api.deezer.com/search');
    const params = { q: `artist:"${artistName}" track:"${title}"` };
    url.search = new URLSearchParams(params).toString();
    return fetch(url)
        .then(r => r.json())
        .then(({ data }) => data[0] || null);
}