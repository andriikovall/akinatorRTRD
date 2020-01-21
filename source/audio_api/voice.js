function recordAndGetSoundBlob(cb) {
    let recorder, gumStream;
    const recordButton = document.getElementById("searchByVoiceButton");
    recordButton.addEventListener("click", toggleRecording);

    function toggleRecording() {
        if (recorder && recorder.state == "recording") {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();
        } else {
            const opts = { audio: true };
            navigator.mediaDevices.getUserMedia(opts)
                .then((stream) => {
                    gumStream = stream;
                    recorder = new MediaRecorder(stream);
                    recorder.ondataavailable = function (e) {
                        cb(e.data);
                    };
                    recorder.start();
                });
        }
    }
}

function createFormDataFromObj(obj) {
    const formData = new FormData();

    for (const name in obj) {
        formData.append(name, obj[name]);
    }

    return formData;
}

recordAndGetSoundBlob(data => {
    const formData = createFormDataFromObj({
        api_token: audApiToken, 
        return: 'apple_music,deezer,spotify',
        file: data
    });
    fetch('https://api.audd.io/', {
        method: 'POST', 
        body: formData
    })
    .then(r => r.json()) 
    .then(res => {
        console.log(res);
    })
});
