function openModalForSong(song) {
    if (!song) {
        alertSongNotFound();
        renderTable();
        return;
    }
    if (song.deezer && song.deezer.id && song.deezer.link) {
        song.id = song.deezer.id;
        song.link = song.deezer.link;
        song.artist = song.deezer.artist;
        checkIfHasPlayer(song.id, song.id, true);
        openModal(song);
    } else {
        getDetailedSongInfo(song.title, song.artist)
            .then(x => {
                if (!x) {
                    openModalWithoutPlayer(song);
                } else {
                    checkIfHasPlayer(song.song_id, x.id, true);
                    openModal(x);
                }
            });
    }

    function openModal({
        title,
        artist: {
            name
        },
        id,
        link,
        full_title
    }) {
        $('#resultModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('.modal-body #player').html(createSongPlayerByDeezId(id));
        $('#title').html(full_title || title || '--');
        $('#author').html(name || artist || '--');
        $('#link-row').css('display', 'table-row');
        $('#link').attr("href", link);
        // todo more fields probably
    }

    function openModalWithoutPlayer({
        title,
        artist,
        full_title
    }) {
        $('#resultModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('.modal-body #player').html("");
        $('#title').html(full_title || title || '--');
        $('#author').html(artist || '--');
        $('#link-row').css('display', 'none');
    }



    function checkIfHasPlayer(song_id, deezer_id, hasPlayer) {
        let answHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
        answHistory.forEach(element => {
            if (element) {
                if (element.song_id === song_id) {
                    element.hasPlayer = hasPlayer;
                    element.deezer_id = deezer_id;
                }
            }
        });
        sessionStorage.setItem("answersHistory", JSON.stringify(answHistory));
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
        .then(({
            data
        }) => {
            return data[0] || null;
        });

}