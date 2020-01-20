
console.log("im in");

const searchByLyricsButton = document.getElementById("searchByLyricsButton");
const searchByLyricsInput = document.getElementById("searchByLyricsInput");
const resultsListBlock = document.getElementById("resultsList");
const currentResultPlayer = document.getElementById("playerContainer");

function onSearchByLyrics(event) {
    event.preventDefault();

    console.log("on Text Search");
    fetch(`https://api.audd.io/findLyrics/?q=${searchByLyricsInput.value}`, {
        method: 'POST',
        body: JSON.stringify({
            api_token: audApiToken,
            result: "deezer",
        }),

    }).then(x => {
        console.log(x);

        return x.json();
    }).then(res => {
        console.log(res);
        saveFetchResult(res);
        renderResult();
    }).catch(x => {
        console.log(x);
    })
}
function renderResult() {
    const currRoundInfo = getCurrRoundInfo();
    if (currRoundInfo) {
        currRoundInfo.forEach(element => {
            resultsListBlock.innerHTML += `<li>${element[0].full_title}</li>`
        });
        currentResultPlayer.innerHTML = createSongPlayerByDeezId(currRoundInfo[currRoundInfo.length - 1][0].song_id);
    }
    console.log("Rendering...");
}
function getCurrRoundInfo() {
    return JSON.parse(localStorage.getItem("rounds"))[localStorage.getItem("currRound")];
}
function saveFetchResult(response) {
    // IF PLAYING FOR THE VERU FIRST TIME
    if (!localStorage.getItem("currRound") || !localStorage.getItem("rounds")) {
        localStorage.setItem("currRound", 1);
        localStorage.setItem("rounds", JSON.stringify([[], []]));
        console.log('!localStorage.getItem("currRound") || !localStorage.getItem("rounds")');

    }

    let currRoundIndex = localStorage.getItem("currRound");
    console.log(`Current round: ${currRoundIndex}`);
    let rounds = JSON.parse(localStorage.getItem("rounds"));

    // IN CASE OF ERRORS
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
    //console.log(localStorage);
    if (currRound.length >= 5) {
        console.log("currRound.length >= 4");
        console.log("FINISHING ROUNd");
        //TODO FINISH ROUND
    }
}



searchByLyricsButton.addEventListener("click", onSearchByLyrics);

// fetch(`https://api.audd.io/findLyrics/?q=${searchByLyricsInput.value}`,{
//     method: 'GET',
//     api_token :"289e48d732e255211003381b8b5940db",
//     return: 'deezer',
// }).then(x=>{