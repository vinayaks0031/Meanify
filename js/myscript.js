document.addEventListener('mouseup', function (e) {
	e.preventDefault();
	var sel = window.getSelection().toString();
	if (sel.length>0) {
		chrome.runtime.sendMessage({ word: sel }, (response) => {
			response;
		})
	}
	sel="";
})