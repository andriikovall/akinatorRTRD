# aMusMe
aMusMe web-app is a game which consists of separate rounds, in which user gives the app few hints about some song he is thinking about. If the app can guess the song by hints in 5 attempts, user loses.

[Live Demo](https://ziovio.github.io/akinatorRTRD/) 

### Game Manual
There are two game modes, you can swap them with arrow button(NOTE that you will restart current round)
- search by sound
- search by lyrics, title or author

You should enter your hint and follow app's questions. After round finishes, you could check answer variants and open players for them. For more description, please check Description chapter below.

Recomendations:

- Please use sound from sound reproducing devices. App doesn't support low-quality sound or humming
- When searching by Lyrics, be sure to pay attention to all the commas, spaces etc.
- Sometimes 5 attempts is not enough to find your song, try to give more informative hints. 
- Custom modyfying of your browser's sessionStorage can affect app's work.
- In case of problems, refresh page or reload your web-browser.

## Description
### App's Features
- Game consist of rounds. Each round can increase players score but can't decrease it.
- There are two gamemodes, changing them restarts current round without losing score. They work separatly, becouse Audd.io provides different API responces, which can't be compared.
- Player gets app's answer in modal windows. Answers history is available during the current round and before starting a new one.
- Alghorythm search for song as an intersection for all the hints. If there is no intersection for them all, app creates queue with priority and takes the first item. Priority(1-5) is granted for the number of hints appropriate for answer. For the next hint, there will be found an intersection with that queue. 
- Because of alghorythm, if user gives app two or more hints with no intersection, songs appropriate for each hint will be equally possible as guessed one. That's why if player give second hit absolutely inappropriate to the first one, he will receive an answer that is appropriate to the first hint, but it will be equally possible with the ones appropriate for the second hint.
- Because of Audd.io Api, there could be found only 10 songs per request, that's why some songs couldn't be found without accurate hints.
- If a hint has no answer, user will be informed by a modal window. In This case, app will continue search as if there were no hint. List item in answer's history will be filled with error message. Round with 5 empty results is won by user, as if app couldn't guess the right song.
- Click on history list item opens player for it, if it's possible.
- Round's result is shown by modal windows with info and GIF's. 
- Refreshing page will restart round, but save current score
- Most of the modal windows are unskipable, design is adaptive, but was tested for only the most popular screen sizes.

and all the other features. There may be some uncritical bugs. There could be critical bug with Audd.io api_token.

### Stack and API used

We used [audd.io](https://audd.io/) API for sound and text recognition and [deezer api](https://rapidapi.com/deezerdevs/api/deezer-1) for song player widget. The problems with using APIs are written in __Desciption__

The app was build with plain __html__, __css__ and __js__. App was hosted using GitHub public pages.

### Quick start
- Clone the repo
- Add your audd.io api_token to source/config.js
- Open ```index.html```

[Live Demo](https://ziovio.github.io/akinatorRTRD/) 

## RTRD team
[Vladyslav Mortikov](https://www.facebook.com/vladislavmortikov?fref=profile_friend_list&hc_location=friends_tab)

[Andrii Koval](https://github.com/ZioVio)

[Yaroslav Klymenko](https://github.com/yklym)

[Volodymyr Symoniuk](https://github.com/vsymoniuk) 
