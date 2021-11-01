showItems();
console.log(showItems)
//getting the data from API
async function getData(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
}
//injecting the Data in localstorage
function getMeaning() {
    let wordinput = document.getElementById("wordinput").value;
    let a = getData(wordinput);
    a.then((data) => {
        const { word, phonetic } = data[0];
        const { definition, example, synonyms } = data[0].meanings[0].definitions[0];
        const { audio } = data[0].phonetics[0];
        let wordObj = {
            word: word,
            phonetic: phonetic,
            definition: definition,
            example: example,
            synonyms: synonyms,
            audio: audio
        }
        //Getting data from localstorage and pushing new data into it
        let meaninglyWords = localStorage.getItem("meaninglyWords")
        if (meaninglyWords == null) {
            getWordsObj = [];
        } else {
            getWordsObj = JSON.parse(meaninglyWords)
        }
        getWordsObj.push(wordObj);
        localStorage.setItem("meaninglyWords", JSON.stringify(getWordsObj));
    })
}

function showItems() {
    let meaninglyWords = localStorage.getItem("meaninglyWords")
    if (meaninglyWords == null) {
        getWordsObj = [];
    } else {
        getWordsObj = JSON.parse(meaninglyWords)
    }
    let html = "";
    getWordsObj.forEach((element, index) => {
        html += `<div id="wordContainer">
        <div class="words-container d-flex">
        <div class="index">
            <p>${index + 1}</p>
        </div>
        <div class="main-content">
            <p class="m-word"><span class="b-text main-word">${element.word}</span> or ${element.phonetic}</p>

            <p><span class="b-text">Meaning:</span> ${element.definition}</p>
            <p><span class="b-text">Example:</span> ${element.example == undefined ? "" : element.example}</p>
            <p><i>synonyms: ${element.synonyms[0] == undefined ? "" : element.synonyms[0]+","} ${element.synonyms[1] == undefined ? "" : element.synonyms[1]+","} ${element.synonyms[2] == undefined ? "" : element.synonyms[2]+","} ${element.synonyms[3] == undefined ? "" : element.synonyms[3]+","} ${element.synonyms[4] == undefined ? "" : element.synonyms[4]}</i></p>
        </div>
        <div class="icons">
            <i class="fas fa-volume-up fa-2x" id="${index}" onclick="playSound(this.id)"></i>
            <i class="fas fa-trash fa-2x" id="${index}" onclick="deleteWord(this.id)"></i>
        </div>
    </div>
    </div>`
    });
    let wordBox = document.getElementById("wordBox");
    if (getWordsObj.length != 0) {
        wordBox.innerHTML = html;
    } else {
        wordBox.innerHTML = `<p>Nothing to show! Please Add some words first.</p>`;

    }
}
//function to play sounds
function playSound(index) {
    let meaninglyWords = localStorage.getItem("meaninglyWords")
    if (meaninglyWords == null) {
        getWordsObj = [];
    } else {
        getWordsObj = JSON.parse(meaninglyWords)
    }
    let getAudio = getWordsObj[index].audio;
    let sound = new Audio(getAudio);
    sound.play();
}

//delete existing word from local storage
function deleteWord(index) {
    let meaninglyWords = localStorage.getItem("meaninglyWords")
    if (meaninglyWords == null) {
        getWordsObj = [];
    } else {
        getWordsObj = JSON.parse(meaninglyWords)
    }
    getWordsObj.splice(index, 1);
    localStorage.setItem("meaninglyWords", JSON.stringify(getWordsObj));
    showItems();
}

//search functionality
let search = document.getElementById("search");
search.addEventListener("input",()=>{
    let inputTxt=search.value;
    let wordsContainer=document.querySelectorAll("div#wordContainer")
    Array.from(wordsContainer).forEach((element) => {
        let mainWord=element.querySelector("span.main-word").innerText;
        if(mainWord.includes(inputTxt)){
            element.style.display ="block";
        }
        else{
            element.style.display = "none";
        }
    });
})