document.addEventListener('mouseup', function (e) { 
	e.preventDefault();
	var sel = window.getSelection().toString(); //storing the word that we've selected
	if (sel.length > 0) {
		    chrome.runtime.sendMessage({ word: sel },(response)=>{ //sending this word to -> background.js
                console.log(response.text); //getting some response from background.js
		    });
	}
	sel = "";
});