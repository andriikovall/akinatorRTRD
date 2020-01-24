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
    try {
        onSearchByVoiceStart();
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