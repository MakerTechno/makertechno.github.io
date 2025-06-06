const url = 'https://api.github.com/users/MakerTechno/';

async function fetchGithub() {
	try {
		let repoCount, totalStars, totalForks;

		const cache = getCache('GithubStatistics');

		if (!cache) {
			const response = await fetch(url + 'repos');
			const data = await response.json();

			repoCount = data.length;
			totalStars = data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
			totalForks = data.reduce((sum, repo) => sum + repo.forks_count, 0);

			setCache('GithubStatistics', JSON.stringify({
				repoCount,
				totalStars,
				totalForks
			}), 24);
		} else {
			const parsedCache = JSON.parse(cache);
			repoCount = parsedCache.repoCount;
			totalStars = parsedCache.totalStars;
			totalForks = parsedCache.totalForks;
		}

		document.querySelectorAll(".repoCount").forEach(el => el.innerText = repoCount ?? "未知");
		document.querySelectorAll(".starsCount").forEach(el => el.innerText = totalStars ?? "未知");
		document.querySelectorAll(".forksCount").forEach(el => el.innerText = totalForks ?? "未知");

	} catch (error) {
		document.querySelectorAll(".repoCount").forEach(el => el.innerText = "获取失败");
		document.querySelectorAll(".starsCount").forEach(el => el.innerText = "获取失败");
		document.querySelectorAll(".forksCount").forEach(el => el.innerText = "获取失败");
	}
}


document.addEventListener("DOMContentLoaded", function() {
	fetchGithub();
});

function setCache(key, value, expireHours) {
	const now = new Date().getTime();
	const expireTime = now + expireHours * 60 * 60 * 1000;
	const data = {
		value,
		expireTime
	};
	localStorage.setItem(key, JSON.stringify(data));
}

function getCache(key) {
	const dataStr = localStorage.getItem(key);
	if (!dataStr) return null;

	const data = JSON.parse(dataStr);
	if (new Date().getTime() > data.expireTime) {
		localStorage.removeItem(key);
		return null;
	}
	return data.value;
}

// 存储信息，时长为12小时
// setCache('myData', 'Hello, MakerTechno!', 12);

// 读取信息
// console.log(getCache('myData'));