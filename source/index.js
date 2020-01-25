const searchByLyricsButton = document.getElementById("searchByLyricsButton");
const searchByLyricsInput = document.getElementById("searchByLyricsInput");
const resultsTableBlock = document.getElementById("resultsTable");
const currentResultPlayer = document.getElementById("playerContainer");
const supposeRejectButton = document.getElementById("supposeRejectButton");
const supposeConfirmButton = document.getElementById("supposeConfirmButton");

sessionStorage.setItem("playerPlaseholder", "true")

function onSupposeReject(event) {
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));

    if (answersHistory.length >= 5) {
        alertVictory();
        finishRound();
        increaseScore();
    }

    renderTable();
}

function onSupposeConfirm(event) {
    finishRound();
    alertLose();
}

function finishRound() {
    let currRound = sessionStorage.getItem("currRound");
    renderTable();
    sessionStorage.setItem("currRound", JSON.stringify(1 + parseInt(currRound)));
    sessionStorage.setItem("answers", JSON.stringify([]));
    sessionStorage.setItem("answersHistory", JSON.stringify([]));
}

function onSearchByMicroStart(event) {
    // я уже сделал похожые функции, так что нету смысла реализововать
}

function onSearchByMicroFinish(event) {

}

function onSearchByLyrics(event) {
    event.preventDefault();

    const input = searchByLyricsInput.value;
    if (input.length < 3) {
        mdtoast('Input must contain at least 3 letters', { duration: 3000 });
        return;
    }

    searchByLyricsButton.innerHTML =
        `<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Searching...</span>
    </div>`;
    searchByLyricsButton.disabled = true;

    const url = new URL('https://api.audd.io/findLyrics/');
    const params = {
        q: `${input}`
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
        saveFetchResult(res.result);
        clearTable();
        showModal();

    }).then(res2 => {
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

    openModalForSong(answVariant);
}

function clearTable() {
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    let rounds = JSON.parse(sessionStorage.getItem("rounds"));
    let currRoundIndex = JSON.parse(sessionStorage.getItem("currRound"));

    const checkIfRoundsIsEmpty = rounds[currRoundIndex];
    const checkIfAnswerHistoryIsEmpty = (!answersHistory || !answersHistory.length);
    if ((checkIfAnswerHistoryIsEmpty && checkIfRoundsIsEmpty) || answersHistory.length >= 5) {
        resultsTableBlock.innerHTML = "";
    }
}

function onSongClicked(event) {
    event.preventDefault();

    const target = event.target.tagName === 'TR' ? event.target : event.target.parentNode;
    const id = target.getAttribute('song_id');

    const playerContainer = document.getElementById('playerContainer');
    if (id != 0) {
        document.getElementById('playerPlaceholder').style.display = "none";
        playerContainer.style.display = "block";
        playerContainer.style.height = '250px';
        playerContainer.innerHTML = createSongPlayerByDeezId(id, 230);
    } else {
        document.getElementById('playerPlaceholder').style.display = "block";
        playerContainer.style.display = "none";
        mdtoast("This song doesn't have a player", { duration: 7000 });
    }


}

function renderTable() {
    const answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    // resultsTableBlock.innerHTML= "";

    let check = answersHistory.every(elem => !elem);
    if (check) {
        resultsTableBlock.innerHTML +=
            `<tr song_id="0"><th scope="row">${answersHistory.length}</th><td>---No result---</td></tr>`;
    } else {

        let lastAnswer = answersHistory[answersHistory.length - 1];
        resultsTableBlock.innerHTML +=
            `<tr song_id="${lastAnswer.hasPlayer ? lastAnswer.deezer_id : 0}"
            onclick="onSongClicked(event)"><th scope="row">${answersHistory.length}
            </th><td>${lastAnswer.full_title || lastAnswer.title}</td></tr>`;
    }
}

function shiftAnswersArray() {
    let answersArray = JSON.parse(sessionStorage.getItem("answers")) || [];
    let returnAnswer = answersArray.shift();

    sessionStorage.setItem("answers", JSON.stringify(answersArray));

    let answersHistory = JSON.parse(sessionStorage.getItem("answersHistory"));
    if (!answersHistory) {
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
        sessionStorage.setItem("score", JSON.stringify(0));
        sessionStorage.setItem("answersHistory", JSON.stringify([]));
    }

    let currRoundIndex = sessionStorage.getItem("currRound");
    let rounds = JSON.parse(sessionStorage.getItem("rounds"));

    let currRound = rounds[currRoundIndex];

    if (!currRound) {
        rounds[currRoundIndex] = new Array();
        currRound = rounds[currRoundIndex];
    }

    if (currRound.length >= 5) {
        return false;
    }

    currRound.push(response);

    sessionStorage.setItem("rounds", JSON.stringify(rounds));

    let answerArray = JSON.parse(sessionStorage.getItem("answers"));
    if (!answerArray.length) {
        if (currRound && (currRound.length - 1)) {
            recompileAnswers();
        } else {
            sessionStorage.setItem("answers", JSON.stringify(response));
        }
    } else {
        answerArray = findSimilar(answerArray, response);
        if (!answerArray.length) {
            recompileAnswers();
        } else {
            sessionStorage.setItem("answers", JSON.stringify(answerArray));
        }
    }
}

function recompileAnswers() {
    const currentRoundArray = JSON.parse(sessionStorage.getItem("rounds"))[sessionStorage.getItem("currRound")];

    let allVariants = [];
    currentRoundArray.forEach(element => {
        allVariants = allVariants.concat(element);
    });

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

        resultsMatrix[tmpIterator].push(tmpVar1);
    }


    let newAnswersArray = new Array();

    for (let i = resultsMatrix.length - 1; i > 0; i--) {
        for (let j = 0; j < resultsMatrix[i].length; j++) {
            newAnswersArray.push(resultsMatrix[i][j]);
        }
    }

    const answHistory = JSON.parse(sessionStorage.getItem("answersHistory"));

    if (answHistory) {
        answHistory.forEach(a => {
            if(a){
                newAnswersArray = newAnswersArray.filter(b => {
                    if(b){
                        return b.song_id !== a.song_id;
                    }
                })
            }
        });
    }
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
    return inter;
}

function renderScore() {
    const userScore = sessionStorage.getItem("score");
    let alertText = `<bold>Your score:</bold>[${userScore}]`
    if (!userScore) {
        let alertText = `<bold>Your score:</bold>[0]`;
    }

    // RENDER LABEL WITH SCORE HERE
}

function increaseScore() {
    let currScore = sessionStorage.getItem("score");
    if (currScore) {
        currScore = parseInt(currScore);
        sessionStorage.setItem("score", currScore + 1);
    } else {
        sessionStorage.setItem("score", 1);
    }
    renderScore();
}

function initStorage() {
    let rounds = sessionStorage.getItem("rounds")
    if (rounds) {
        rounds = JSON.parse(rounds);
        const currRoundIndex = sessionStorage.getItem("currRound");
        rounds[currRoundIndex] = [];
        sessionStorage.setItem("rounds", JSON.stringify(rounds));
    }
    sessionStorage.setItem("answers", JSON.stringify([]));
    sessionStorage.setItem("answersHistory", JSON.stringify([]));
    renderScore();

}
searchByLyricsButton.addEventListener("click", onSearchByLyrics);
supposeRejectButton.addEventListener("click", onSupposeReject);
supposeConfirmButton.addEventListener("click", onSupposeConfirm);
// @todo refactor
document.addEventListener("DOMContentLoaded", initStorage);

function renderScore() {
    const userScore = sessionStorage.getItem("score");
    let text = `Your score: ${userScore || 0}`;
    document.getElementById("score").innerHTML = text
}