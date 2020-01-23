const { onSearchByVoiceStart, onSearchByVoiceEnd } = (function () {
    let recorder, gumStream;

    function toggleRecording(cb) {
        if (recorder && recorder.state == "recording") {
            recorder.ondataavailable = function (e) {
                cb(e.data);
            };
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();
        } else {
            const opts = { audio: true };
            navigator.mediaDevices.getUserMedia(opts)
                .then((stream) => {
                    gumStream = stream;
                    recorder = new MediaRecorder(stream);
                    recorder.start();
                });
        }
    }

    function makeRequest(fileData, cb) {
        const formData = createFormDataFromObj({
            api_token: audApiToken, 
            return: 'deezer',
            file: fileData
        });
        fetch('https://api.audd.io/', {
            method: 'POST', 
            body: formData
        })
        .then(r => r.json()) 
        .then(cb);
    }
    
    
    function createFormDataFromObj(obj) {
        const formData = new FormData();
    
        for (const name in obj) {
            formData.append(name, obj[name]);
        }
    
        return formData;
    }

        function stopRecording(cb) {
            toggleRecording(fileData => makeRequest(fileData, cb));
        }

    return {
        onSearchByVoiceStart: toggleRecording,
        onSearchByVoiceEnd: () => stopRecording(handleVoiceResponse)
    }
})();


function handleVoiceResponse({ result }) {
    if (!result) {
        //handle somehow
    }
    getDetailedSongInfo(result.title, result.artist)
    .then(({ id }) => { 
            console.log(id);
            result.song_id = id;
            return result;
        })
        .then(r => {
            clearTable();
            saveFetchResult(r);
            showModal();
        });
}