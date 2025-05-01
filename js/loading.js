let skipAnim = false; //给很急的人用的调试模式, 除了初次加载外并没有快多少
let alwaysAnim = false;

/* 
@author MakerTechno
结构排列(“·”表示声明，“+”表示直接运行，“-”表示废弃)：
|
+  锁/解 滑动条
|
·  标签页第一次载入的判断、记录与转发
|
·  主题动画分镜所需元素的初始化
|
+  随机星星背景
|
+  图标动画(包括loading字)元素初始化
|
|
+  图标动画参数初始化
|
|
·  图标所需绘制函数
|
|
|
|
+  页面开始计时，调控动画时长
|
+  开始绘画
|
+  监听加载完成事件
|
·  对加载动画元素的隐藏
|
↓
 */

/* 锁定和解锁网页滚动的功能，只是用来确保用户放完加载动画后能看到网页开头 */
function lockScroll() {
	let widthBar = 17,
		root = document.documentElement;
	if (typeof window.innerWidth == 'number') {
		widthBar = window.innerWidth - root.clientWidth;
	}
	root.style.overflow = 'hidden';
	root.style.borderRight = widthBar + 'px solid transparent';
}

function unlockScroll() {
	let root = document.documentElement;
	root.style.overflow = '';
	root.style.borderRight = '';
}


/* 用户是否第一次载入网站 */
var is1stOpen = true;
const queryParams = new URLSearchParams(window.location.search);
if (alwaysAnim) is1stOpen = true;
else if (queryParams.has('anit')) is1stOpen = false;
else if (sessionStorage.getItem('1stOpenTag') == null) sessionStorage.setItem('1stOpenTag', '0');
else is1stOpen = false;


/* 动画组目标 */
const loader = document.createElement('div');
loader.id = 'loader';
loader.className = 'loader';

const loaderText1 = document.createElement('h2');
loaderText1.id = 'loaderText1';
loaderText1.innerText = 'MakerTechno';

const loaderText2 = document.createElement('h4');
loaderText2.id = 'loaderText2';
loaderText2.innerText = 'Sparkling ideas collide to create a brilliant blaze';

loader.appendChild(loaderText1);
loader.appendChild(loaderText2);

document.body.appendChild(loader);
document.body.style.backgroundColor = '#000000';

/* 生成随机闪烁的星星背板 */
if (is1stOpen) {
	var starCount = 100;
	for (var i = 0; i < starCount; i++) {
		var star = document.createElement('div');
		star.className = 'star';
		star.style.top = Math.random() * 100 + 'vh';
		star.style.left = Math.random() * 100 + 'vw';
		star.style.animationDuration = Math.random() * 2 + 1 + 's';
		loader.appendChild(star);
	}
}


/* M标识动画主体部分 */
const canvasContainer = document.createElement('div');
canvasContainer.id = 'canvas-container';

let scrW = window.innerWidth;
let scrH = window.innerHeight;
var AccessibleSpace = Math.min(scrW, scrH) * 0.6;

const canvas1 = document.createElement('canvas');
canvas1.id = 'canvas1';
canvas1.innerText = 'Your browser does not support the HTML5 canvas tag.';
canvasContainer.appendChild(canvas1);
canvas1.setAttribute('width', AccessibleSpace * 2);
canvas1.setAttribute('height', AccessibleSpace * 2);
canvas1.style.width = AccessibleSpace + 'px';
canvas1.style.height = AccessibleSpace + 'px';

let ctx1 = canvas1.getContext('2d');
ctx1.lineCap = "round"
ctx1.strokeStyle = 'white';
ctx1.lineWidth = AccessibleSpace * 0.08;

const canvas2 = document.createElement('canvas');
canvas2.id = 'canvas2';
canvas2.innerText = 'Your browser does not support the HTML5 canvas tag.';
canvasContainer.appendChild(canvas2);
canvas2.setAttribute('width', AccessibleSpace * 2);
canvas2.setAttribute('height', AccessibleSpace * 2);
canvas2.style.width = AccessibleSpace + 'px';
canvas2.style.height = AccessibleSpace + 'px';

let ctx2 = canvas2.getContext('2d');
ctx2.lineCap = "round"
ctx2.strokeStyle = 'white';
ctx2.fillStyle = 'white';
ctx2.lineWidth = 16;

const text = document.createElement('h1');
text.id = 'text';
text.innerText = 'Now loading...';
text.style.fontSize = '6vh'
text.style.whiteSpace = 'nowrap'
text.style.animation = 'fadeIn 4s ease-in-out forwards'
canvasContainer.appendChild(text);
document.body.appendChild(canvasContainer);


/*--------设置半圆的参数--------*/
let centerX = canvas1.width / 2; // 圆心X坐标
let centerY = canvas1.height / 2; // 圆心Y坐标
let startAngle = -Math.PI / 2; // 开始角度
let endAngle = Math.PI; // 结束角度
let radius = Math.min(centerX, centerY) / 2; // 半径

let duration = 60; // 动画持续时间
let currentTime = 0; // 当前时间

let alpha = 0; // 初始透明度
let increase = 0.04; // 透明度增加的速度


/*--------设置画M的参数--------*/
let mixSize = radius * 0.5 // M字缩放大小
let durationM = 120; // 动画持续时间
let currentTimeM = 0; // 当前时间


/*--------设置画四点的参数--------*/
let mixSizeO = radius * 1.2; // 点相对于中心的距离
let alpSph = 0; // 四点的透明度
let radiusO = radius * 0.22; // 四个点的圆半径大小

let duration2 = 120; // 动画持续时间
let currentTime2 = 0; // 当前时间

let startAngle2 = 0; // 开始角度
let endAngle2 = 4 * Math.PI; // 结束角度

let reverse = false; // 四点反转标记

const delay = 40; // 正反转延迟
let delayTime = 0; // 延迟标记


/* Quad型缓动函数 */
function easeInOutQuad(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t--;
	return -c / 2 * (t * (t - 2) - 1) + b;
}


/* M字x反馈函数 */
function getMPoint(x) {
	if (x <= 0 || x > 2) return 0;
	x--;
	if (x <= -0.98) return 100 * (x + 1);
	else if (x <= 0) return -1.8 * x + 0.236;
	else if (x <= 0.98) return 1.8 * x + 0.236;
	else return -100 * (x - 1);
}


/* 半圆动画函数 */
function drawArc(current) {
	ctx1.beginPath();
	ctx1.arc(centerX, centerY, radius, startAngle, current, false);
	ctx1.stroke();
	ctx1.beginPath();
	ctx1.arc(centerX, centerY, radius, startAngle + Math.PI, current + Math.PI, false);
	ctx1.stroke();
}


/*--------实现半圆前两点的逐渐出现--------*/
function circleAppear() {
	ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

	ctx1.globalAlpha = alpha;

	drawArc(startAngle + 0.001);

	alpha += increase;
	if (alpha > 1) {
		alpha = 1;
		ctx1.globalAlpha = alpha;
		circleSide();
	} else requestAnimationFrame(circleAppear);
}


/*--------画半圆--------*/
function circleSide() {
	ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

	// 计算当前角度
	let currentAngle = easeInOutQuad(currentTime, startAngle, endAngle, duration);

	drawArc(currentAngle);

	currentTime += 1;
	if (currentTime <= duration) {
		requestAnimationFrame(circleSide);
	} else {
		drawM();
		drawPoint();
	}
}


/* 简化M字运算的函数 */
function mFaster(x0, y0) {
	ctx1.lineTo(centerX - mixSize * (x0), centerY - mixSize * getMPoint(y0) + mixSize);
	ctx1.stroke();
	ctx1.beginPath();
	ctx1.moveTo(centerX - mixSize * (x0), centerY - mixSize * getMPoint(y0) + mixSize);
}


/*--------画M字--------*/
function drawM() {
	ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
	drawArc(startAngle + endAngle);

	ctx1.beginPath();
	ctx1.moveTo(centerX - mixSize, centerY - mixSize * getMPoint(0) + mixSize);
	let x = easeInOutQuad(easeInOutQuad(currentTimeM, 0, 2, durationM), 0, 2, 2);

	if (x > 0.02) mFaster(1 - 0.02, 0.02);
	if (x > 1) mFaster(0, 1);
	if (x > 1.98) mFaster(1 - 1.98, 1.98);

	ctx1.lineTo(centerX - mixSize * (1 - x), centerY - mixSize * getMPoint(x) + mixSize);
	ctx1.stroke();

	currentTimeM++;
	if (currentTimeM <= durationM) requestAnimationFrame(drawM);
}


/*--------画点+旋转函数--------*/
function drawPoint() {
	if (delayTime != 0) {
		delayTime--;
	} else {
		alpSph = Math.min(alpSph + increase, 1);
		ctx2.globalAlpha = alpSph;
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

		let currentAngle = easeInOutQuad(currentTime2, startAngle2, endAngle2, duration2);
		currentTime2 += reverse ? -1 : 1;
		let nextAngle = easeInOutQuad(currentTime2, startAngle2, endAngle2, duration2);

		ctx2.translate(centerX, centerY);
		ctx2.rotate(nextAngle - currentAngle);
		ctx2.translate(-centerX, -centerY);

		let b1 = true,
			b2 = true;
		for (let i = 0; i < 4; i++) {
			ctx2.beginPath();
			ctx2.arc(centerX + (b1 ? mixSizeO : -mixSizeO), centerY + (b2 ? mixSizeO : -mixSizeO), radiusO, 0, 2 * Math
				.PI);
			ctx2.fill();
			if (!b1) b2 = !b2;
			b1 = !b1;
		}

		if (currentTime2 === duration2 || currentTime2 === 0) {
			reverse = !reverse;
			delayTime = delay;
		}
	}

	requestAnimationFrame(drawPoint);
}


/* 页面组计时功能，这么好的动画怎么能因为网速太快而看不到呢？ */
let pageLoaded = false,
	isAniOutTimed = false;


setTimeout(() => (pageLoaded ? dispose() : isAniOutTimed = true) , skipAnim?0:7000);
/* 同时如果有加载不出来的东西也不能卡死在这 */
setTimeout(() => {
	if (!pageLoaded) {
		text.style.animation = 'warn 0.25s ease forwards';
		setTimeout(() => {
			text.textContent = 'Resource TIMEOUT';
			text.style.color = 'red';
		}, 126);
	}
},14000);
setTimeout(() => !pageLoaded && dispose(), 16000);

// 开始动画
circleAppear();
lockScroll();


/* 加载完成后隐藏当前界面 */
window.addEventListener('load', function() {
	pageLoaded = true;
	if (isAniOutTimed || !is1stOpen) dispose();
});


function dispose() {
	document.title = "This is MakerTechno";
	document.body.style.backgroundColor = '#ffffff';
	((is1stOpen && !skipAnim)? softDispose : solidDispose)();
	loader.addEventListener('animationend', () => {
		loader.remove();
		unlockScroll();
	});
	canvas1.addEventListener('animationend', () => {
		delayTime = Number.MAX_SAFE_INTEGER;
		canvasContainer.remove();
	});
}

function setAnimations(elements) {
	elements.forEach(([el, anim]) => el.style.animation = anim);
}

function softDispose() {
	setAnimations([
		[loaderText1, 'scale 3s ease-out forwards'],
		[loaderText2, 'scale 3s ease-out forwards'],
		[canvas1, "fadeOut 0.3s ease-in forwards"],
		[canvas2, "fadeOut 0.3s ease-in forwards"],
		[text, 'fadeOut 2s ease-in-out forwards'],
		[loader, 'boardFadeOut 3s ease-in-out forwards']
	]);
}

function solidDispose() {
	loader.style.animation = 'fadeOut 0.7s ease-in forwards';
	loader.querySelectorAll('*').forEach(child => child.style.animation = 'fadeOut 0.8s ease forwards');
	setAnimations([
		[canvas1, 'fadeOut 0.5s ease-in forwards'],
		[canvas2, 'fadeOut 0.5s ease-in forwards'],
		[text, 'fadeOut 0.8s ease forwards']
	]);
}