var data;
chrome.runtime.onMessage.addListener((msg, sender, response) => {
	data = msg.word;
	response({ text: "got the response" });
})

chrome.contextMenus.removeAll(function() {
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
			a.then((data)=>{
				alert(data[0].meanings[0].definitions[0].definition);
			})
		}
	}else{
		alert("invalid selection! Try again")
	}
})
async function getData(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
}