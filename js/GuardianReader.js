var btn = document.getElementById("btn");

var jsonObj = {
	option:"start"
}


var btnClick = function() {
	btn.value = "正在改造...";
	chrome.extension.sendRequest(jsonObj, function(response) {
		if (response == "finish"){
	  		btn.value = "ok";
	  		btn.removeEventListener("click",btnClick,false);
		}
	 });
}

btn.addEventListener("click",btnClick,false);