var data;
chrome.runtime.onMessage.addListener((msg, sender, response) => {
	data = msg.word;
	response({ text: "got the response" });
})

chrome.contextMenus.removeAll(function () {
	chrome.contextMenus.create({
		id: "Meaning",
		title: "Meanify",
		contexts: ["all"]
	});
});

chrome.contextMenus.onClicked.addListener(function () {
	if (data != undefined) {
		let newData = data.trim();
		var spaceCount = (newData.split(" ").length - 1);
		if (spaceCount != 0) {
			alert("invalid selection! Try again")
		}
		else {
			let a = getData(newData);
			a.then((data) => {
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
                let list=new Array();
				chrome.storage.local.get({meanifyWords:[]},(result)=>{
					let meanifyWords=result.meanifyWords;
					meanifyWords.push(wordObj);
					chrome.storage.local.set({meanifyWords:meanifyWords});
				});
				alert(wordObj.definition);
			});
		}
	} else {
		alert("invalid selection! Try again")
	}
});

async function getData(word) {
	const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
	const data = await response.json();
	return data;
}