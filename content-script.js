var header = document.querySelector(".content__headline").innerText;
var small = document.querySelector(".content__standfirst p").innerText;
var img = document.querySelector(".maxed");
var caption = document.querySelector(".caption").innerText;
var article = document.querySelector(".content__article-body").innerText;

//将单词用span标签包裹
function insertSpan(txt,element) {
	var span = document.createElement("span");
	span.innerText = txt+' ';
	element.appendChild(span);
}

//文字段落处理
function textProcess(txt,div) {
	var textArray = txt.split(" ");    //按空格切分文章
	var br = document.createElement("br");

	textArray.forEach(function(item,index,length) {
		var tempTextArray = item.split("\n");    //找出换行部分

		if (tempTextArray.length === 1) {
			insertSpan(item,div);	
		} else {
			tempTextArray.forEach(function(item,index,length) {
				var br = document.createElement("br");
				if ( item != '' ) {
					insertSpan(item,div);
				} else {
					div.appendChild(br);
				};
			});
		};
	});

}

//页面整体处理
function transPage(){
	var htm = document.documentElement,
	    body = document.body,
	    main = document.createElement("div"),
	    ul = document.createElement("ul"),
	    h2 = document.createElement("h2"),
	    smallP = document.createElement("p"),
	    captionP = document.createElement("p"),
	    articleP = document.createElement("p"),
	    h = document.documentElement.clientHeight,
	    w = document.documentElement.clientWidth; 

	
	main.id = "main";
	h2.id = "head"
	smallP.id = "small";
	captionP.id = "caption";
	articleP.id = "article";
	img.id = "imge";
	ul.id = "nav";

	body.innerHTML = '';
	htm.style.height = htm.style.width = "100%";
	body.style.height = body.style.width = "100%";
	body.style.overflow = "hidden";
	


	var imgScale = img.height / img.width;
	img.style.width = w + 'px';
	img.style.height = (w * imgScale) + 'px';

	// 将每个段落处理后加入main
	textProcess(header,h2);
	main.appendChild(h2);
	textProcess(small,smallP);
	main.appendChild(smallP);
	main.appendChild(img);
	textProcess(caption,captionP);
	main.appendChild(captionP);
	textProcess(article,articleP);
	main.appendChild(articleP);

	// 将main加入body
	body.appendChild(main);

	// 计算并加入分页
	var mainHeight = h - 50,
	    mainScrollHeight = main.scrollHeight,
	    page = Math.ceil(mainScrollHeight / mainHeight);
	main.style.height = mainHeight + 'px';
	for (var i = 1; i <= page ; i++ ) {
			(function(j) {
				var li = document.createElement("li");
				li.innerText = j;
				ul.appendChild(li);
			}(i))
		}
	body.appendChild(ul);

}

// 单词解释函数
function showDefinition(x,y,definition,audioSrc) {
	var h = document.documentElement.clientHeight,
		w = document.documentElement.clientWidth;
	var defiDiv = document.createElement("div");
	var wrapDiv = document.createElement("div");	
	var turnOff = document.createElement("a");
	var xb = x < (w * 0.5);
	var yb = y < (h * 0.5);

	wrapDiv.id = "wrap";
	wrapDiv.style.height = h + 'px';
	wrapDiv.style.width = w + 'px';
	defiDiv.id = "definition";
	defiDiv.innerText = definition;
	
	// 如果查询的单词有发音，则加入audio
	if (audioSrc) {
		var audio = document.createElement("audio");
		audio.src = audioSrc;
		audio.autoplay = true;    //发音自动播放
		defiDiv.appendChild(audio);
	};

	// 插入页面
	wrapDiv.appendChild(defiDiv);
	document.body.appendChild(wrapDiv);

	//设置单词解释的位置
	var div = document.getElementById("definition");
	var dh = parseInt(window.getComputedStyle(div).height);
	if (xb) {
		defiDiv.style.left = x + 30 + 'px';
	} else {
		defiDiv.style.left = x - 130 + 'px';
	};
	if (yb) {
		defiDiv.style.top = y + 30 + 'px';
	} else {
		defiDiv.style.top = y - dh - 30 + 'px';
	} ;


}

// 绑定事件函数                
function bindEvent(){
    var body = document.body;

    //将事件委托于body
    body.addEventListener("click",function(event){
        if (event.target.tagName.toLowerCase() === 'span') {    //点击单词
        	var word = (event.target.innerText).match(/\w/g).join("");    //去除span中的符号
        	var jsonObj = {
        		option:"consult",
        		word:word
        	};
			chrome.extension.sendRequest(jsonObj, function(response) {
				if (response.status === "ok"){
			  		showDefinition(event.clientX,event.clientY,response.definition,response.audio);
				} else if (response.status === 'wrong') {
					showDefinition(event.clientX,event.clientY,response.info);
				};
			 });        	
        } else if(event.target.tagName.toLowerCase() === "li") {    //点击导航
        	var page = parseInt(event.target.innerText);
        	var main = document.getElementById("main");
        	main.scrollTop = parseInt(main.style.height) * (page -1);
        } else if (event.target.id === "wrap") {    //点击空白部分移除单词解释
        	body.removeChild(event.target);
        } ;
    });

    //绑定rezise事件
    window.addEventListener("resize",function(event) {
    	transPage();
    } );


}






chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
	    if ( request == 'start-trans') {
	    	transPage();
	    	bindEvent();
	    	sendResponse("finish-trans");
	    };
	}
)

