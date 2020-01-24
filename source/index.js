const searchByLyricsButton = document.getElementById("searchByLyricsButton");
const searchByLyricsInput = document.getElementById("searchByLyricsInput");
const resultsTableBlock = document.getElementById("resultsTable");
const currentResultPlayer = document.getElementById("playerContainer");
const supposeRejectButton = document.getElementById("supposeRejectButton");
const supposeConfirmButton = document.getElementById("supposeConfirmButton");

function onSupposeReject(event) {
    console.log("suppose rejected");
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));

    if(answersHistory.length >= 5){
        alertVictory();
    }
    renderTable();
}

function onSupposeConfirm(event) {
    console.log("suppose confirmed");
    finishRound();
    alertLose();
}

function finishRound() {
    let currRound = sessionStorage.getItem("currRound");
    console.log("Starting round:" + currRound);
    renderTable();
    sessionStorage.setItem("currRound", JSON.stringify(1 + parseInt(currRound)));
    sessionStorage.setItem("answers", JSON.stringify([]));
    sessionStorage.setItem("answersHistory", JSON.stringify([]));
}

function onSearchByLyrics(event) {
    event.preventDefault();

    searchByLyricsButton.innerHTML = 
    `<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Searching...</span>
    </div>`;
    searchByLyricsButton.disabled = true;

    const url = new URL('https://api.audd.io/findLyrics/');
    const params = {
        q: `${searchByLyricsInput.value}`
    };
    url.search = new URLSearchParams(params).toString();
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            return: 'timecode,apple_music,deezer,spotify',
            api_token: audApiToken,
        }),
    }).then(x => {
        return x.json();
    }).then(res => {
        console.log("RESPONCE");
        console.log(res);
        clearTable();
        saveFetchResult(res.result);
        showModal();
        
    }).then(res2=>{
        searchByLyricsButton.innerHTML = 'Search by text';
        searchByLyricsButton.disabled = false;
    }).catch(x => {
        console.log("Error------->");
        console.log(x);
        console.log("------->Error");
    })
}

function showModal() {
    let answVariant = shiftAnswersArray();
    if (!answVariant) {
        console.log("!answVariant");
        //TODO CASE NO ANSWERS
    }
    
    console.log("Answer Variant");
    console.log(answVariant);
    openModalForSong(answVariant);
}

function clearTable() {
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    if (!answersHistory || !answersHistory.length) {
        resultsTableBlock.innerHTML = "";
    }
}

function onSongClicked(event) {
    event.preventDefault();

    const target = event.target.tagName === 'TR' ? event.target : event.target.parentNode;
    const id = target.getAttribute('song_id');

    document.getElementById('playerContainer').innerHTML = createSongPlayerByDeezId(id, 230);
}

function renderTable() {
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    // resultsTableBlock.innerHTML= "";

    let check = answersHistory.every(elem => !elem);
    if (check){
        console.log("Empty Answer History!");
    }
    else  {
        let lastAnswer = answersHistory[answersHistory.length - 1];
        resultsTableBlock.innerHTML +=
            `<tr song_id="${lastAnswer.song_id}" onclick="onSongClicked(event)"><th scope="row">${answersHistory.length}</th><td>${lastAnswer.full_title || lastAnswer.title}</td></tr>`;
    }
    console.log("Rendering Answers Table");
    console.log("----------------------");
}

function shiftAnswersArray() {
    console.log("shiftAnswersArr");
    let answersArray = JSON.parse(sessionStorage.getItem("answers")) || [];
    console.log(answersArray);
    console.log("shifted answ");
    let returnAnswer = answersArray.shift();
    console.log(returnAnswer);

    sessionStorage.setItem("answers", JSON.stringify(answersArray));

    let answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));

    if(answersHistory.every(elem=>!elem) && !returnAnswer ){
        console.log("Answers History is Empty");
        return null;
    }
    answersHistory.push(returnAnswer);
    sessionStorage.setItem("answersHistory", JSON.stringify(answersHistory));

    return returnAnswer;
}

function getPossibleAnswer() {
    return JSON.parse(sessionStorage.getItem("answers"))[0];
}

function saveFetchResult(response) {
    // IF PLAYING FOR THE VERU FIRST TIME
    if (!sessionStorage.getItem("currRound") || !sessionStorage.getItem("rounds")) {
        sessionStorage.setItem("currRound", 1);
        sessionStorage.setItem("rounds", JSON.stringify([
            [],
            []
        ]));
        sessionStorage.setItem("answers", JSON.stringify([]));
        sessionStorage.setItem("answersHistory", JSON.stringify([]));

        console.log('!sessionStorage.getItem("currRound") || !sessionStorage.getItem("rounds")');
    }

    let currRoundIndex = sessionStorage.getItem("currRound");
    let rounds = JSON.parse(sessionStorage.getItem("rounds"));

    console.log(`Current round: ${currRoundIndex}`);

    // IN CASE OF ERRORS or user changing localstor
    if (!rounds) {
        console.log("!rounds");
    }

    let currRound = rounds[currRoundIndex];

    if (!currRound) {
        rounds[currRoundIndex] = new Array();
        currRound = rounds[currRoundIndex];
    }
    // console.log(currRound);

    currRound.push(response);

    sessionStorage.setItem("rounds", JSON.stringify(rounds));

    let answerArray = JSON.parse(sessionStorage.getItem("answers"));
    console.log(`AnswerArray1: ${answerArray}`);
    if (!answerArray.length) {
        console.log('ERR--!answerArray.length');
        if (currRound && (currRound.length - 1)) {
            console.log("RECOMPILE>>>");
            recompileAnswers();
        } else {
            console.log("answers set to default");
            sessionStorage.setItem("answers", JSON.stringify(response));
        }
    } else {
        answerArray = findSimilar(answerArray, response);
        if (!answerArray.length) {
            console.log("RECOMPILE>>>");
            recompileAnswers();
        } else {
            console.log(`SImilars: ${answerArray}`);
            sessionStorage.setItem("answers", JSON.stringify(answerArray));
        }
    }
    // if (currRound.length >= 5) {
    //     console.log("currRound.length > 4");
    //     console.log("FINISHING ROUNd");
    //     return false;
    // }
    // return true;
}

function recompileAnswers() {
    const currentRoundArray = JSON.parse(sessionStorage.getItem("rounds"))[sessionStorage.getItem("currRound")];
    console.log("currentRoundArray:");
    console.log(currentRoundArray);
    let allVariants = [];
    currentRoundArray.forEach(element => {
        allVariants = allVariants.concat(element);
    });
    console.log("All Variants:");
    console.log(allVariants);
    let resultsMatrix = [
        [],
        [],
        [],
        [],
        []
    ];
    let tmpIterator;
    for (let i = 0; i < allVariants.length; i++) {
        tmpIterator = 0;
        let tmpVar1 = allVariants[i];
        for (let j = 0; j < allVariants.length; j++) {
            let tmpVar2 = allVariants[j];
            if (tmpVar1.song_id === tmpVar2.song_id) {
                tmpIterator += 1;
            }
        }

        console.log("Answers");
        console.log(tmpVar1.full_title);
        console.log(tmpIterator);
        resultsMatrix[tmpIterator].push(tmpVar1);
    }
    console.log("REsults Matrix:");
    console.log(resultsMatrix);

    let newAnswersArray = new Array();

    for (let i = resultsMatrix.length - 1; i > 0; i--) {
        for (let j = 0; j < resultsMatrix[i].length; j++) {
            newAnswersArray.push(resultsMatrix[i][j]);
        }
    }
    console.log("New Answers:");
    console.log(newAnswersArray);
    const answHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    if (answHistory) {
        //Deleting rejected answers
        console.log("Deleting rejected answers...");
        answHistory.forEach(a => {
            newAnswersArray = newAnswersArray.filter(b => {
                return b.song_id !== a.song_id;
            })
        });
    }
    console.log("newANSWERS ARRAY:");
    console.log(newAnswersArray);
    sessionStorage.setItem("answers", JSON.stringify(newAnswersArray));
}

function findSimilar(arr1, arr2) {
    let inter = new Array();
    // FINDS INTERSECTION. DONT TOUCH. IT WORKS FOR SURE
    for (let i = 0; i < arr1.length; i++) {
        let tmpObj = arr1[i];
        for (let j = 0; j < arr2.length; j++) {
            if (arr2[j].song_id === arr1[i].song_id) {
                inter.push(arr1[i]);
            }
        }
    }
    console.log("INTER");
    console.log(inter);
    return inter;
}

searchByLyricsButton.addEventListener("click", onSearchByLyrics);
supposeRejectButton.addEventListener("click", onSupposeReject);
supposeConfirmButton.addEventListener("click", onSupposeConfirm);
// @todo refactor