let lastScrollTop = 0;
var stickyBar = null;

function initBar() {
	stickyBar = document.getElementById("sticky-bar");
	window.addEventListener("scroll", () => {
		doSet();
	});
	doSet();
}
fetch("modulePages/stickyBar.html")
	.then(response => response.text())
	.then(data => {
		document.body.insertAdjacentHTML("afterbegin", data);
	})
	.catch(error => console.error("加载顶部条失败：", error));

waitForElement("sticky-bar", () => {
	initBar();
});


function doSet() {
	let scrollTop = window.scrollY;
	let opacity = Math.min(scrollTop / (window.innerHeight / 5 * 4) + 0.1, 1);
	let vp = opacity * 0.2;
	stickyBar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
	stickyBar.style.boxShadow = ` 0px 3px 7px rgba(0, 0, 0, ${vp})`;
	if (scrollTop < window.innerHeight * (4 / 5)) {
		stickyBar.style.top = "0px"; // 吸附到顶部
		stickyBar.style.opacity = 1;
	} else if (scrollTop < lastScrollTop) {
		stickyBar.style.top = "0"; // 向上滚动时出现
	} else {
		stickyBar.style.top = "-60px"; // 向下滚动时隐藏
	}
	lastScrollTop = scrollTop;
}