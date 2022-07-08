showItems();

function showItems() {
    chrome.storage.local.get({ meanifyWords: [] }, (result) => { //taking data from chromeStorage
        let html = "";
        let getWordsObj = result.meanifyWords;
        getWordsObj.forEach((element, index) => {
            html += `<div id="wordContainer">
        <div class="words-container d-flex">
        <div class="index">
            <p>${index + 1}</p>
        </div>
        <div class="main-content">
            <p class="m-word"><span class="b-text main-word">${element.word}</span> or ${element.phonetic == undefined ? "" : element.phonetic}</p>

            <p><span class="b-text">Meaning:</span> ${element.definition}</p>
            <p><span class="b-text">Example:</span> ${element.example == undefined ? "" : element.example}</p>
            <p><i>synonyms: ${element.synonyms[0] == undefined ? "" : element.synonyms[0] + ","} ${element.synonyms[1] == undefined ? "" : element.synonyms[1] + ","} ${element.synonyms[2] == undefined ? "" : element.synonyms[2] + ","} ${element.synonyms[3] == undefined ? "" : element.synonyms[3] + ","} ${element.synonyms[4] == undefined ? "" : element.synonyms[4]}</i></p>
        </div>
        <div class="icons">
            <i class="fas ${element.audio != undefined && element.audio.length != 0  ? "fa-volume-up" : "fa-microphone-slash"} fa-2x audioBtn" id="${index}" ></i>
            <i class="fas fa-trash fa-2x deleteBtn" id="${index}" ></i>
        </div>
    </div>
    </div>`
        });
        html+=`<p class="reload-note">Recently added words are not visible? reload the page.</p>`;
        let wordBox = document.getElementById("wordBox");
        if (getWordsObj.length != 0) {
            wordBox.innerHTML = html;
        } else {
            wordBox.innerHTML = `<p>Nothing to show! Please Add some words first.</p>`;
        }
    });
}

// function to play sounds
document.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.matches('.audioBtn')) {
        chrome.storage.local.get({ meanifyWords: [] }, (result) => {
            let getWordsObj = result.meanifyWords;
            let getAudio = getWordsObj[e.target.id].audio;
            let sound = new Audio(getAudio);
            sound.play();
        });
    }
});

//delete existing word from local storage
document.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.matches('.deleteBtn')) {
        chrome.storage.local.get({ meanifyWords: [] }, (result) => {
            let getWordsObj = result.meanifyWords;
            getWordsObj.splice(e.target.id, 1);
            chrome.storage.local.set({ meanifyWords: getWordsObj });
            showItems();
        });
    }
});

//search functionality
let search = document.getElementById("search");
search.addEventListener("input", () => {
    let inputTxt = search.value;
    let wordsContainer = document.querySelectorAll("div#wordContainer")
    Array.from(wordsContainer).forEach((element) => {
        let mainWord = element.querySelector("span.main-word").innerText;
        if (mainWord.includes(inputTxt)) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });
});