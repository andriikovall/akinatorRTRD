const { startRecording, stopRecording } = (function () {
    let recorder, gumStream;

    function toggleRecording(cb) {
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

    function makeRequest(fileData, cb) {
        const formData = createFormDataFromObj({
            api_token: audApiToken, 
            return: 'apple_music,deezer,spotify',
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


    return {
        startRecording: (cb) => {
            toggleRecording(fileData => makeRequest(fileData, cb));   
        },
        stopRecording: toggleRecording
    }
})();


