const iframe = document.getElementById('codeFrame');

var isLightMode = true;
/* 
document.getElementById('lightSwitcherBtn').addEventListener('click', () => {
	isLightMode = !isLightMode;
	if (isLightMode) {
		sendMSG('lightMode');
	} else {
		sendMSG('darkMode');
	}
}); */

function sendMSG(mode) {
	iframe.contentWindow.postMessage({
		type: "CUSTOM_MESSAGE",
		payload: {
			data: mode,
		}
	}, 
	'*');
}
setTimeout(sendMSG('lightMode'), 2000);