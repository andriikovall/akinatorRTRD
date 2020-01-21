const searchByLyricsButton = document.getElementById("searchByLyricsButton");
const searchByLyricsInput = document.getElementById("searchByLyricsInput");
const resultsTableBlock = document.getElementById("resultsTable");
const currentResultPlayer = document.getElementById("playerContainer");
const supposeRejectionButton = document.getElementById("supposeRejectionButton");

function onSupposeReject(event) {
    renderTable();
}
function onSearchByLyrics(event) {
    event.preventDefault();

    console.log("on Text Search");
    fetch(`https://api.audd.io/findLyrics/?q=${searchByLyricsInput.value}`, {
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
        saveFetchResult(res);
        showModal();

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
    openModalForSong(answVariant.deezer);
}
// @todo
function renderTable() {
    const answersHistory = JSON.parse(localStorage.getItem("answersHistory"));
    // resultsTableBlock.innerHTML= "";
    if (answersHistory) {
            let lastAnswer = answersHistory[answersHistory.length - 1];
            resultsTableBlock.innerHTML += `<tr song_id="${lastAnswer.song_id}"><th scope="row">${answersHistory.length}</th><td>${lastAnswer.full_title}</td></tr>`;
    }
    console.log("Rendering Answers Table");
    console.log("----------------------");
}
function shiftAnswersArray() {
    console.log("shiftAnswersArr");
    let answersArray = JSON.parse(localStorage.getItem("answers"));
    let returnAnswer = answersArray.shift();
    localStorage.setItem("answers", JSON.stringify(answersArray));

    let answersHistory = JSON.parse(localStorage.getItem("answersHistory"));
    answersHistory.push(returnAnswer);
    localStorage.setItem("answersHistory", JSON.stringify(answersHistory));
    
    return returnAnswer;
}
function getPossAnswer() {
    return JSON.parse(localStorage.getItem("answers"))[0];
}

function saveFetchResult(response) {
    // IF PLAYING FOR THE VERU FIRST TIME
    if (!localStorage.getItem("currRound") || !localStorage.getItem("rounds")) {
        localStorage.setItem("currRound", 1);
        localStorage.setItem("rounds", JSON.stringify([[], []]));
        localStorage.setItem("answers", JSON.stringify([]));
        localStorage.setItem("answersHistory", JSON.stringify([]));

        console.log('!localStorage.getItem("currRound") || !localStorage.getItem("rounds")');
    }

    let currRoundIndex = localStorage.getItem("currRound");
    let rounds = JSON.parse(localStorage.getItem("rounds"));

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

    currRound.push(response.result);

    localStorage.setItem("rounds", JSON.stringify(rounds));

    let answerArray = JSON.parse(localStorage.getItem("answers"));
    console.log(`AnswerArray1: ${answerArray}`);
    if (!answerArray.length) {
        console.log('ERR--!answerArray.length');
        if (currRound && (currRound.length - 1)) {
            console.log("RECOMPILE>>>");
            recompileAnswers();
        } else {
            console.log("answers set to default");
            localStorage.setItem("answers", JSON.stringify(response.result));
        }
    } else {
        answerArray = findSimilar(answerArray, response.result);
        if (!answerArray.length) {
            console.log("RECOMPILE>>>");
            recompileAnswers();
        } else {
            console.log(`SImilars: ${answerArray}`);
            localStorage.setItem("answers", JSON.stringify(answerArray));
        }
    }

    //console.log(localStorage);
    if (currRound.length >= 5) {
        console.log("currRound.length >= 4");
        console.log("FINISHING ROUNd");
        //TODO FINISH ROUND
    }
}

function recompileAnswers() {
    const currentRoundArray = JSON.parse(localStorage.getItem("rounds"))[localStorage.getItem("currRound")];
    console.log("currentRoundArray:");
    console.log(currentRoundArray);
    let allVariants = [];
    currentRoundArray.forEach(element => {
        allVariants = allVariants.concat(element);
    });
    console.log("All Variants:");
    console.log(allVariants);
    let resultsMatrix = [[], [], [], [], []];
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
    const answHistory = JSON.parse(localStorage.getItem("answersHistory"));
    if (answHistory) {
        //Deleting rejected answers
        console.log("Deleting rejected answers...");
        answHistory.forEach(a => {
            newAnswersArray = newAnswersArray.filter(b => {
                b.song_id !== a.song_id;
            })
        });
    }

    localStorage.setItem("answers", JSON.stringify(newAnswersArray));
}
function findSimilar(arr1, arr2) {
    console.log("ARRS:");
    console.log(arr1);
    console.log(arr2);
    let inter = new Array();
    for (let i = 0; i < arr1.length; i++) {
        let tmpObj = arr1[i];
        for (let j = 0; j < arr2.length; j++) {
            if (arr2[j].song_id === arr1[i].song_id) {
                inter.push(arr1[i]);
            }
        }
    }
    // let inter= arr1.filter(x => arr2.includes(x));
    console.log("INTER");
    console.log(inter);
    return inter;
}

searchByLyricsButton.addEventListener("click", onSearchByLyrics);
supposeRejectionButton.addEventListener("click", onSupposeReject);