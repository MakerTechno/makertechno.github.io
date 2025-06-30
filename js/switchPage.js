// 获取终端的相关信息
var now = new Date();
var month = now.getMonth();
var day = now.getDate();

var language = (navigator.browserLanguage || navigator.language).toLowerCase()

document.addEventListener('DOMContentLoaded', function() {
	document.title = "Redirecting...";
});

try {
	if (month == 3 && day == 1) {
		window.location.href = "./hide/index.html"
	} else {
		switch (language) {
			case 'en-us':
				window.location.href = "main.html";
			case 'zh-cn':
				window.location.href = "main.html";
			default:
				window.location.href = "main.html";
		}
	}
} catch (e) {}