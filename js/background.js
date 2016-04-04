//查词函数
var consultWord = function(word) {
	var result = {};    //结果对象
	var xhr = new XMLHttpRequest();
	var baseURL = "https://api.shanbay.com/bdc/search/?word=";
	var consultURL = [baseURL,word].join("");
	xhr.open("get",consultURL,false);
	xhr.send(null);
	//同步xhr，所以不需要onreadystatechange

	//根据请求状态生成结果对象result
	if (xhr.status == 200) {
		var jsonObj = JSON.parse(xhr.responseText);
		if (jsonObj.status_code == 0) {
			result =  {
				status:'ok',
				definition:jsonObj.data.definition,
				audio:jsonObj.data.audio
			};
		} else {
			result =  {
				status:'wrong',
				info:jsonObj.msg
			};
		};
	} else {
		result =  {
			status:'wrong',
			info:"无法连接查词服务"
		};
	}	
	return result;
}



//监听popup页面请求
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		var tabId;

		//点击“开始转换页面”后
	    if (request.option == "start"){

	    	//找到活动标签页的id并与之通信
	    	chrome.tabs.query({
				active:true,
				currentWindow:true
			}, function(tabArray) {
				tabId = tabArray[0].id;

				//通知content-js开始改造页面
	    		chrome.tabs.sendRequest(tabId,"start-trans", function(response) {	//发出"start-trans"通知content-js开始改造页面 
	    			//content-js返回finish-trans，则说明页面改造完毕
	    			//通知popup页面改造完毕
					if (response == "finish-trans"){	
	  					sendResponse("finish");
					}
	 			});

			});
	    	
	    //接收到content-js的查词请求
	    } else if (request.option == "consult") {
	    	var res = consultWord(request.word);
	    		sendResponse(res);
	    } ;
	}
)




