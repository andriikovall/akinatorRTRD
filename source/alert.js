function alertVictory() {
    $('#victoryModal').modal();
}

function alertLose() {
    $('#loseModal').modal();
}

function alertSongNotFound() {
    $('#songNotFoundModal').modal();
}

function alertStartRecording() {
    $('#recordingModal').modal();
}

function alertStopRecording() {
    document.getElementById('recording-btn').style.display = 'none'
    document.getElementById('recordingModalLabel').innerHTML = 'Recording completed'
    document.getElementById('recordingModalFooter').style.display = 'inline'
}

function toDefault() {
    document.getElementById('recording-btn').style.display = 'inline'
    document.getElementById('recordingModalLabel').innerHTML = 'Recording...'
    document.getElementById('recordingModalFooter').style.display = 'none'
}