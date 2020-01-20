function onModalOpen(e) {
    e.preventDefault();
    openModalForSong({ song_id: 3004817 });
}

function openModalForSong({ song_id, title, author, }) {
    $('#resultModal').modal(); // hardcoded modal id
    $('.modal-body #player').html(createSongPlayerByDeezId(song_id));
    $('#title').html(title || '--');
    $('#author').html(author || '--');
    // todo more fields probably
}