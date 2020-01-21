function onModalOpen(e) {
    e.preventDefault();
    openModalForSong({ song_id: 3004817 });
}

function openModalForSong({ id, title, artist, }) {
    $('#resultModal').modal(); // hardcoded modal id
    $('.modal-body #player').html(createSongPlayerByDeezId(id));
    $('#title').html(title || '--');
    $('#author').html(artist.name || '--');
    // todo more fields probably
}