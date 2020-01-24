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

function alertChangeGamemode() {
    $('#gmChangingModal').modal();
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

function gmSound() {
    sessionStorage.setItem("mode", "sound");
    document.getElementById('soundBlock').style.display = "inline"
}

function gmText() {
    sessionStorage.setItem("mode", "text");
    document.getElementById('textBlock').style.display = "inline"
}

function changeGamemode() {
    if (sessionStorage.getItem("mode") === "sound") {
        sessionStorage.setItem("mode", "text")
        document.getElementById('textBlock').style.display = "inline"
        document.getElementById('soundBlock').style.display = "none"
    } else if (sessionStorage.getItem("mode") === "text") {
        sessionStorage.setItem("mode", "sound")
        document.getElementById('soundBlock').style.display = "inline"
        document.getElementById('textBlock').style.display = "none"
    }
}

$('#choosingModal').modal({ backdrop: 'static' });