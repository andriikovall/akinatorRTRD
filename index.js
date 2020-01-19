const searchLyricsButton = document.getElementById("searchForm");
const searchLyricsInput = document.getElementById("searchFormInput");

function onSearchByLyrics(event){
    event.preventDefault();
    console.log("onSearch");
    fetch(`https://api.audd.io/findLyrics/?q=${searchLyricsInput.value}`,{
        'method': 'POST',
        'api_token' :audApiToken,
    }).then(x=>{
        console.log(x);

        return x.json();
    }).then(res=>{
        console.log(res);
    }).catch(x=>{
        console.log(x);
    })
}

searchLyricsButton.addEventListener("click", onSearchByLyrics);
