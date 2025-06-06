// 获取终端的相关信息
var now = new Date();
var month = now.getMonth();
var day = now.getDate();

var Terminal = {
	// 辨别移动终端类型
	platform: function() {
		var u = navigator.userAgent, app = navigator.appVersion;
		
		return {
			// android终端或者uc浏览器
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
			
			// 是否为iPhone或者QQHD浏览器
			iPhone: u.indexOf('iPhone') > -1,
			
			// 是否iPad
			iPad: u.indexOf('iPad') > -1
		};
	}(),
	// 辨别移动终端的语言
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

try {
	if (month == 3 && day == 1) {
		window.location.href = "./hide/index.html"
	} else {
		switch (Terminal.language) {
			case 'en-us':
				window.location.href = "Test.html";
			case 'zh-cn':
				window.location.href = "Testc.html";
			default:
				window.location.href = "Testc.html";
		}
	}
} catch (e) {}