var data;
chrome.runtime.onMessage.addListener((msg, sender, response) => { //receiving data from myscript
	data = msg.word;
	response({ text: "got the response" }); //sending some response to myscript
});

chrome.contextMenus.removeAll(function () {
	chrome.contextMenus.create({ //declaring the use of right click
		id: "Meaning",
		title: "Meanify",
		contexts: ["all"]
	});
});

chrome.contextMenus.onClicked.addListener(function () {
	if (data != undefined) { //checks word is selected
		let newData = data.trim();
		var spaceCount = (newData.split(" ").length - 1);
		if (spaceCount != 0) {
			alert("invalid selection! Try again");
		}
		else {
			let a = getData(newData);
			a.then((data) => {
				if (data.message != undefined) { //giving massage =>word is not in dictionary 
                    alert(data.message);
					return; //exits the function 
				}
				const { word, phonetic } = data[0]; 
				const { definition, example, synonyms } = data[0].meanings[0].definitions[0];
				if (data[0].phonetics[0] == undefined) {
					var wordObj = {
						word: word,
						phonetic: phonetic,
						definition: definition,
						example: example,
						synonyms: synonyms
					}
				} else {
					const { audio } = data[0].phonetics[0];
					var wordObj = {
						word: word,
						phonetic: phonetic,
						definition: definition,
						example: example,
						synonyms: synonyms,
						audio: audio
					}
				}
				//Adding new object in chrome storagelocal
				chrome.storage.local.get({ meanifyWords: [] }, (result) => {
					let meanifyWords = result.meanifyWords;
					let isPresent=false;
					//checking the word is already present in disc or not
					for (let index = 0; index < meanifyWords.length; index++) {
						if(meanifyWords[index].word.includes(wordObj.word)) isPresent=true;
					}
					if(!isPresent){ //if not present then push
					meanifyWords.push(wordObj);
					chrome.storage.local.set({ meanifyWords: meanifyWords });
					}
				});
				alert(wordObj.definition);
			});
		}
	} 
	else {
		alert("invalid selection! Try again");
	}
});

async function getData(word) { //calling the api for word
	const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
	const data = await response.json();
	return data;
}