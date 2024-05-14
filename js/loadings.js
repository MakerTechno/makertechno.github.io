let scrW = document.documentElement.scrollWidth;
let scrH = document.documentElement.scrollHeight;
var AccessibleSpace = Math.min(scrW, scrH) * 0.6;

let canvas = document.getElementById('canvas1');
canvas.setAttribute('width', AccessibleSpace * 2);
canvas.setAttribute('height', AccessibleSpace * 2);
canvas.style.width = AccessibleSpace + 'px';
canvas.style.height = AccessibleSpace + 'px';

let ctx = canvas.getContext('2d');
ctx.lineCap = "round"
ctx.strokeStyle = 'white';
ctx.lineWidth = AccessibleSpace * 0.08;


let canvas2 = document.getElementById('canvas2');
canvas2.setAttribute('width', AccessibleSpace * 2);
canvas2.setAttribute('height', AccessibleSpace * 2);
canvas2.style.width = AccessibleSpace + 'px';
canvas2.style.height = AccessibleSpace + 'px';

let ctx2 = canvas2.getContext('2d');
ctx2.lineCap = "round"
ctx2.strokeStyle = 'white';
ctx2.fillStyle = 'white';
ctx2.lineWidth = 16;



/*--------设置半圆的参数--------*/
let centerX = canvas.width / 2; // 圆心X坐标
let centerY = canvas.height / 2; // 圆心Y坐标
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



// 缓动函数Quad
function easeInOutQuad(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t--;
	return -c / 2 * (t * (t - 2) - 1) + b;
}


// M字x反馈函数
function getMPoint(x) {
	if (x <= 0 || x > 2) return 0;
	x--;
	if (x <= -0.98) return 100 * (x + 1);
	else if (x <= 0) return -1.8 * x + 0.236;
	else if (x <= 0.98) return 1.8 * x + 0.236;
	else return -100 * (x - 1);
}

function drawArc(current) {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, current, false);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle + Math.PI, current + Math.PI, false);
	ctx.stroke();
}


/*--------实现半圆前两点的逐渐出现--------*/
function circleAppear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.globalAlpha = alpha;

	drawArc(startAngle + 0.001);

	alpha += increase;
	if (alpha > 1) {
		alpha = 1;
		circleSide();
	} else requestAnimationFrame(circleAppear);
}


/*--------画半圆--------*/
function circleSide() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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


function mFaster(x0, y0) {
	ctx.lineTo(centerX - mixSize * (x0), centerY - mixSize * getMPoint(y0) + mixSize);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(centerX - mixSize * (x0), centerY - mixSize * getMPoint(y0) + mixSize);
}

/*--------画M字--------*/
function drawM() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawArc(startAngle + endAngle);

	ctx.beginPath();
	ctx.moveTo(centerX - mixSize, centerY - mixSize * getMPoint(0) + mixSize);
	let x = easeInOutQuad(easeInOutQuad(currentTimeM, 0, 2, durationM), 0, 2, 2);

	if (x > 0.02) {
		mFaster(1 - 0.02, 0.02);
	}
	if (x > 1) {
		mFaster(0, 1);
	}
	if (x > 1.98) {
		mFaster(1 - 1.98, 1.98);
	}
	ctx.lineTo(centerX - mixSize * (1 - x), centerY - mixSize * getMPoint(x) + mixSize);
	ctx.stroke();


	currentTimeM++;
	if (currentTimeM <= durationM) {
		requestAnimationFrame(drawM);
	}
}


/*--------画点+旋转函数--------*/
function drawPoint() {
	if (delayTime != 0) {
		delayTime--;
	} else {
		alpSph += increase;
		if (alpSph > 1) alpSph = 1;

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
				.PI, false);
			ctx2.fill();
			if (!b1) b2 = !b2;
			b1 = !b1;
		}

		if (currentTime2 == duration2 || currentTime2 == 0) {
			reverse = !reverse;
			delayTime = delay;
		}
	}
	requestAnimationFrame(drawPoint);
}


// 开始动画
circleAppear();


let alpDiv = 1;
let div = document.getElementById('loadingSpace')
//加载完成后隐藏当前界面
window.onload = function() {
	decreaseAlpha();
};

function decreaseAlpha() {
	alpDiv -= increase;
	if (alpDiv < 0) alpDiv = 0;
	div.style.opacity = alpDiv;
	if (alpDiv != 0) requestAnimationFrame(decreaseAlpha);
	else {
		delayTime = Number.MAX_SAFE_INTEGER;
		div.style.scale = 0;
	}
}