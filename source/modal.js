function openModalForSong(song) {
    if (song.deezer && song.deezer.id && song.deezer.link) {
        song.id = song.deezer.id;
        song.link = song.deezer.link;
        song.artist = song.deezer.artist; // бля пизда. АПИ АУДД.ио пизда ебаная
        openModal(song);
    } else {
        getDetailedSongInfo(song.title, song.artist)
            .then(x => {
                console.log("AFTER THEN");
                console.log(x);
                openModal(x);
            });
    }

    function openModal({ title, artist: { name }, id, link }) {
        if (arguments[0] == null) {
            //todo smth with null song
        }
        $('#resultModal').modal({ backdrop: 'static', keyboard: false }); // hardcoded modal id
        $('.modal-body #player').html(createSongPlayerByDeezId(id));
        $('#title').html(title || '--');
        $('#author').html(name || '--');
        $('#link').attr("href", link);
        // todo more fields probably
    }
}


function getDetailedSongInfo(title, artistName) {
    const url = new URL('https://deezerdevs-deezer.p.rapidapi.com/search');
    const params = {
        q: `artist:"${artistName}" track:"${title}"`
    };
    url.search = new URLSearchParams(params).toString();
    return fetch(url, {
        headers: {
            'x-rapidapi-host': "deezerdevs-deezer.p.rapidapi.com",
            'x-rapidapi-key': "0ee7afc8d1mshd9501b1c8aabc51p14888fjsn7a2b7463f5d2"
        }
    })
        .then(r => r.json())
        .then(({ data }) => data[0] || null);
}