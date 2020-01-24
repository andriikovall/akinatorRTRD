function openModalForSong(song) {
    if (!song) {
        console.log("SOng Cant be found");
        alertSongNotFound();
        renderTable();

        return;
    }
    if (song.deezer && song.deezer.id && song.deezer.link) {
        song.id = song.deezer.id;
        song.link = song.deezer.link;
        song.artist = song.deezer.artist;
        openModal(song);
    } else {
        getDetailedSongInfo(song.title, song.artist)
            .then(x => {
                if (!x) {
                    openModalWithoutPlayer(song);
                } else {
                    openModal(x);
                }
            });
    }

    function openModal({ title, artist: { name }, id, link }) {
        console.log('OPEN MODAL');
        console.log(arguments[0]);
        if (arguments[0] == null) {
            //todo smth with null song
        }
        $('#resultModal').modal({ backdrop: 'static', keyboard: false }); // hardcoded modal id
        $('.modal-body #player').html(createSongPlayerByDeezId(id));
        $('#title').html(title || '--');
        $('#author').html(artist || name || '--');
        $('#link').attr("href", link);
        // todo more fields probably
    }

    function openModalWithoutPlayer({ title, artist }) {
        if (arguments[0] == null) {
            //todo smth with null song
        }
        console.log('openModalWithoutPlayer');
        console.log(arguments[0]);
        $('#resultModal').modal({ backdrop: 'static', keyboard: false }); // hardcoded modal id
        $('#title').html(title || '--');
        $('#author').html(artist || '--');
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