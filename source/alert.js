function alertVictory() {
    $('#victoryModal').modal();
    // setTimeout(() => $('#songNotFoundModal').modal('toggle'), 1000);
}

function alertLose() {
    $('#loseModal').modal();
}

function alertSongNotFound() {
    $('#songNotFoundModal').modal();
}

function alertStartRecording() {
    try {
        onSearchByVoiceStart();
        $('#recordingModalLabel').html('Recording...');
        $('#recordingModal').modal();
    } catch {
        //
    }
}

function alertChangeGamemode() {
    $('#gmChangingModal').modal();
}

function alertStopRecording() {
    onSearchByVoiceEnd();
    const recordingModalLabel = document.getElementById('recordingModalLabel');
    recordingModalLabel.innerHTML = 'Recording completed';
    recordingModalLabel.style.display = 'inline';
    setTimeout(() => $('#recordingModal').modal('toggle'), 1000);
}

function toDefault() {
    document.getElementById('recording-btn').style.display = 'inline';
    document.getElementById('recordingModalLabel').innerHTML = 'Recording...';
    document.getElementById('recordingModalFooter').style.display = 'none';
}

function gmSound() {
    sessionStorage.setItem('mode', 'sound');
    document.getElementById('searchByLyricsButton').style.display = 'none';
    document.getElementById('textBlock').style.display = 'none';
    document.getElementById('soundBlock').style.display = 'inline-block';
}

function gmText() {
    sessionStorage.setItem('mode', 'text');
    document.getElementById('searchByLyricsButton').style.display = 'block';
    document.getElementById('textBlock').style.display = 'inline-block';
    document.getElementById('soundBlock').style.display = 'none';
}

function changeGamemode() {
    if (sessionStorage.getItem('mode') === 'sound') {
        gmText();
    } else if (sessionStorage.getItem('mode') === 'text') {
        gmSound();
    }
    clearTable();
    const currRoundIndex = parseInt(sessionStorage.getItem('currRound'));
    const rounds = JSON.parse(sessionStorage.getItem('rounds'));
    rounds[currRoundIndex] = [];
    sessionStorage.setItem('rounds', JSON.stringify(rounds));
    sessionStorage.setItem("answersHistory", JSON.stringify([]));
}

$('#choosingModal').modal({ backdrop: 'static' });