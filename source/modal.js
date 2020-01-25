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
                console.log("X");
                console.log(x);
                if (!x) {
                    openModalWithoutPlayer(song);
                } else {
                    console.log("CHecking for player...");
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
        console.log('OPEN MODAL');
        console.log(arguments[0]);
        if (arguments[0] == null) {
            //todo smth with null song
        }
        $('#resultModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('.modal-body #player').html(createSongPlayerByDeezId(id));
        $('#title').html(full_title || title || '--');
        $('#author').html(name|| artist || '--');
        $('#link-row').css('display', 'table-row');
        $('#link').attr("href", link);
        // todo more fields probably
    }

    function openModalWithoutPlayer({
        title,
        artist,
        full_title
    }) {

        if (arguments[0] == null) {
            //todo smth with null song
        }
        console.log('openModalWithoutPlayer');
        console.log(arguments[0]);
        $('#resultModal').modal({
            backdrop: 'static',
            keyboard: false
        }); // hardcoded modal id
        $('.modal-body #player').html("");
        $('#title').html(full_title || title || '--');
        $('#author').html(artist || '--');
        $('#link-row').css('display', 'none');
    }



    function checkIfHasPlayer(song_id, deezer_id, hasPlayer) {
        let answHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
        console.log("CHECK IF HAS PLAYER");
        answHistory.forEach(element => {
            if (element.song_id === song_id) {
                element.hasPlayer = hasPlayer;
                element.deezer_id = deezer_id;

                console.log(`Set ${element.title || element.full_title} Has player to ${hasPlayer}`);
            }
        });
        console.log("answ History:");
        console.log(answHistory);
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
            console.log("DATA & DATA[0]");
            console.log(data);
            return data[0] || null;
        });
}