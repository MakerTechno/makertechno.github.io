const overlay = document.createElement('div');
overlay.id = 'overlay';
document.body.appendChild(overlay);
document.addEventListener('DOMContentLoaded', function() {
	var links = document.querySelectorAll('a');

	links.forEach(function(link) {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			var newUrl = link.getAttribute('href');
			overlay.style.display = 'block';
			overlay.style.animation = 'fadeIn 0.8s ease-out forwards';

			setTimeout(function() {
				window.location.href = newUrl;
			}, 900); 
		});
	});
});