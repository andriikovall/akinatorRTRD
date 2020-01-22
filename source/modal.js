// function openModalForSong({ title, artist }) {
//     const url = new URL('https://api.deezer.com/search');
//     const params = { q: `artist:"${artist}" track:"${title}"` };
//     url.search = new URLSearchParams(params).toString();
//     fetch(url)
//         .then(r => r.json())
//         .then(({ data }) => data[0] || null)
//         .then(openModal);

//     function openModal({ title, artist: { name }, id, link }) {
//         if (arguments[0] == null) {
//             //todo smth with null song
//         }
//         $('#resultModal').modal({backdrop: 'static',keyboard: false}); // hardcoded modal id
//         $('.modal-body #player').html(createSongPlayerByDeezId(id));
//         $('#title').html(title || '--');
//         $('#author').html(name || '--');
//         $('#link').attr("href", link);
//         // todo more fields probably
//     }
// }
function onModalOpen(e) {
    e.preventDefault();
    openModalForSong({ song_id: 3004817 });
}

function openModalForSong({ song_id, title, author, }) {
    $('#resultModal').modal({backdrop: 'static',keyboard: false}); // hardcoded modal id
    $('.modal-body #player').html(createSongPlayerByDeezId(song_id));
    $('#title').html(title || '--');
    $('#author').html(author || '--');

    // todo more fields probably
}