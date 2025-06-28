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

