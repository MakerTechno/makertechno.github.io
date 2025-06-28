// 是不是你在看我的码 👊😠
//var indexAnimate = indexAnimate || {};
const animateCanvas = document.createElement('canvas');
animateCanvas.id = 'animateCanvas';
animateCanvas.innerText = 'Your browser does not support the HTML5 canvas tag.';
document.body.appendChild(animateCanvas);

const aniCtx = animateCanvas.getContext('2d');
aniCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';

const particles = [];
const numParticles = 400;
const forceMagic = 0.1100;
const clockwiseParticles = Math.floor(numParticles * 0.5);
const counterClockwiseParticles = numParticles - clockwiseParticles;

let targetX = animateCanvas.width / 2;
let targetY = animateCanvas.height / 2;
let targetRadius = Math.min(animateCanvas.width, animateCanvas.height) * 0.45;

let isInsideOuterContainer = false;
let isInsideElement = false;
let anchorpt = false;
var anchorElement = null;

const basedFallCount = 200;
const paraFallCount = 120;
var isOutOfIntro = false;
var autoFallOpacity = basedFallCount;

class Particle {
	constructor(x, y, clockwise, speed) {
		this.x = x;
		this.y = y;
		this.angle = Math.random() * 2 * Math.PI;
		this.speed = speed;
		this.radius = Math.random() * 2 + 1;
		this.clockwise = clockwise;
		this.editSpeed = 0.00;
	}

	update() {
		this.angle += this.clockwise ? 0.02 : -0.02;
		this.x += Math.cos(this.angle) * this.speed * (this.editSpeed + 1);
		this.y += Math.sin(this.angle) * this.speed * (this.editSpeed + 1);

		const dx = targetX - this.x;
		const dy = targetY - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const force = (distance - targetRadius) / distance;

		this.x += dx * force * forceMagic;
		this.y += dy * force * forceMagic;
		if (this.editSpeed != 0.00) {
			if (this.editSpeed > 0.1) this.editSpeed -= 0.1;
			else this.editSpeed = 0.00;
		}
	}

	draw() {
		aniCtx.beginPath();
		aniCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		aniCtx.fill();
	}
}

function cubicOut(t) {
	return --t * t * t + 1;
}

function init() {
	for (let i = 0; i < clockwiseParticles; i++) {
		const x = Math.random() * animateCanvas.width;
		const y = Math.random() * animateCanvas.height;
		const speed = Math.random() * 2 + 1;
		particles.push(new Particle(x, y, true, speed));
	}
	for (let i = 0; i < counterClockwiseParticles; i++) {
		const x = Math.random() * animateCanvas.width;
		const y = Math.random() * animateCanvas.height;
		const speed = Math.random() * 2 + 1;
		particles.push(new Particle(x, y, false, speed));
	}
}

function animate() {
	aniCtx.clearRect(0, 0, animateCanvas.width, animateCanvas.height);
	particles.forEach(particle => {
		particle.update();
		particle.draw();
	});

	if (isOutOfIntro) {
		if (autoFallOpacity > 0) {
			autoFallOpacity--;
			if (animateCanvas.style.opacity != 0.8) animateCanvas.style.opacity = 0.8;
		} else if (animateCanvas.style.opacity != 0.4) animateCanvas.style.opacity = 0.4;
	} else {
		if (animateCanvas.style.opacity != 0.8) animateCanvas.style.opacity = 0.8;
		autoFallOpacity = basedFallCount;
	}

	requestAnimationFrame(animate);
}

function setTargetPosition(x, y, radius) {
	targetX = x;
	targetY = y;
	targetRadius = radius;
}

function disperseParticles(size) {
	particles.forEach(particle => {
		particle.editSpeed = (Math.random() + 1) * size;
	});
	autoFallOpacity = paraFallCount;
}

document.querySelectorAll('.animateOutboard').forEach(element => {
	element.addEventListener('mouseenter', () => {
		isInsideOuterContainer = true;
	});

	element.addEventListener('mouseleave', () => {
		isInsideOuterContainer = false;
		if (!isInsideElement && anchorpt) {
			disperseParticles(3.6);
			anchorpt = false;
		}
		setTargetPosition(animateCanvas.width / 2, animateCanvas.height / 2, Math.min(animateCanvas
				.width, animateCanvas.height) *
			0.45);
	});
});

document.querySelectorAll('.animatedElement').forEach(element => {
	element.addEventListener('mouseenter', () => {
		isInsideElement = true;
		anchorpt = true;
		anchorElement = element;
		const rect = element.getBoundingClientRect();
		setTargetPosition(rect.left + rect.width / 2, rect.top + rect.height / 2, Math.max(rect
			.width, rect.height) / 2 + 20);
		disperseParticles(1.6);
	});

	element.addEventListener('mouseleave', () => {
		isInsideElement = false;
		if (isInsideOuterContainer) {
			setTargetPosition(targetX, targetY, targetRadius);
		}
	});
});

document.querySelectorAll('.animateMaintainer').forEach(element => {
	element.addEventListener('mouseenter', () => {
		isInsideElement = true;
		anchorpt = true;
		anchorElement = element.querySelector(".animateFocus");
		const rect = anchorElement.getBoundingClientRect();
		setTargetPosition(rect.left + rect.width / 2, rect.top + rect.height / 2, Math.max(rect
			.width, rect.height) / 2 + 20);
		disperseParticles(1.6);
	});

	element.addEventListener('mouseleave', () => {
		isInsideElement = false;
		disperseParticles(3.6);
		anchorpt = false;
		setTargetPosition(animateCanvas.width / 2, animateCanvas.height / 2, Math.min(animateCanvas
				.width, animateCanvas.height) *
			0.45);
	});
});

window.addEventListener('scroll', function() {
	if (anchorpt) {
		const anchorRect = anchorElement.getBoundingClientRect();
		setTargetPosition(anchorRect.left + anchorRect.width / 2, anchorRect.top + anchorRect.height / 2, Math
			.max(anchorRect.width, anchorRect.height) / 2 + 20);
	}
	if (window.scrollY / (window.innerHeight / 5 * 4) + 0.1 > 1) isOutOfIntro = true;
	else isOutOfIntro = false;
	autoFallOpacity = paraFallCount;
});

function resizeCanvas() {
	animateCanvas.width = window.innerWidth;
	animateCanvas.height = window.innerHeight;
	if (particles != null) {
		disperseParticles(1.2);
		if (anchorpt) {
			const anchorRect = anchorElement.getBoundingClientRect();
			setTargetPosition(anchorRect.left + anchorRect.width / 2, anchorRect.top + anchorRect.height / 2, Math
				.max(anchorRect.width, anchorRect.height) / 2 + 20);
		} else {
			setTargetPosition(animateCanvas.width / 2, animateCanvas.height / 2, Math.min(animateCanvas
					.width, animateCanvas.height) *
				0.45);
		}
	}
}
// 当窗口大小变化时调整尺寸
window.addEventListener('resize', resizeCanvas);


document.addEventListener("DOMContentLoaded", function() {
	resizeCanvas();
	init();
	animate();
});