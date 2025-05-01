var jump = false;
const ERROR_CODE = "System.out.println(\"Sorry, it's a network error, code can't play until refreshed.\");"
const TABSPACE = "    ";

const injectPort = document.getElementById("codeEntry");
const cursor = document.createElement('span');
cursor.id = 'cursor';

setLight();

function setLight() {
	document.body.style.backgroundColor = 'white';
	document.body.style.color = 'black';
	injectPort.style.backgroundColor = 'white';
	injectPort.style.color = 'black';
	untiredSetHLJS('white');
}

function setDark() {
	document.body.style.backgroundColor = 'black';
	document.body.style.color = 'white';
	injectPort.style.backgroundColor = 'black';
	injectPort.style.color = 'white';
	untiredSetHLJS('black');
}

function untiredSetHLJS(mode) {
	unloadCSS('dynamic-css')
	if (mode == 'black') {
		loadCSS("../css/codeDark.css")
	} else {
		loadCSS("../css/codeLight.css")
	}
}

function loadCSS(cssURL) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = cssURL;
	link.id = 'dynamic-css';
	document.head.appendChild(link);
}

function unloadCSS(cssID) {
	const link = document.getElementById(cssID);
	if (link) {
		document.head.removeChild(link);
	}
}


hljs.configure({
	useBR: true, // 禁用自动换行
	ignoreIllegals: true, // 忽略非法代码
	ignoreUnescapedHTML: true
});


/* 全闭区间 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getFileContent(name, enableBugsEgg) {
	if (enableBugsEgg && getRandomInt(0,50) == 0) return await ERROR_CODE;
	try {
		const response = await fetch(name + ".txt");
		return await response.text();
	} catch (error) {
		console.error("无法加载文本文件:", error);
		return await ERROR_CODE;
	}
}

async function playSegment() {
	const code = await getFileContent(getRandomInt(0, 4).toString(), true);
	injectPort.textContent = "";
	injectPort.appendChild(cursor);
	var extraCount = 0;
	var spaceJump = false;
	var fasternComment = "";
	var stableI = 0;

	for (let i = 0; i < code.length; i++) {
		stableI = i;
		spaceJump = false;
		fasternComment = "";
		if (jump) extraCount = -70;
		else if (code[i] == " ") {
			if (i + 1 < code.length && code[i + 1] == " ") {
				extraCount = -70;
				if (i + 3 < code.length && code.substring(i, i + 4) == TABSPACE) {
					i += 3;
					spaceJump = true;
					fasternComment += TABSPACE;
					extraCount = 0;
				}
			}
			else extraCount = getRandomInt(0, 300);
		} else if (i + 1 < code.length && code[i + 1] == "\n") extraCount = 600;
		else if (code[i] == "\n") {
			fasternComment = "\n";
			while (i + 4 < code.length && code.substring(i + 1, i + 5) == TABSPACE) {
				i += 4;
				spaceJump = true;
				fasternComment += TABSPACE;
			}
		}
		else extraCount = 0;
		
		cursor.insertAdjacentText('beforebegin', spaceJump ? fasternComment : code[stableI]);
		
		delete injectPort.dataset.highlighted;
		hljs.highlightElement(injectPort);
		if (!injectPort.contains(cursor)) {
			injectPort.appendChild(cursor); // 如果光标丢失，重新添加
		}
		window.scrollTo(0, document.body.scrollHeight);
		await new Promise(resolve => setTimeout(resolve, 70 + extraCount));
	}
	
	if (code != ERROR_CODE) setTimeout(playSegment, 8000);
}

playSegment(); // 启动播放