let navBarInnerHtml = db.reduce((t,i) => { 
	let name = i['name']; 
	return t + 
		`
		<li class="navbar-item">
			<a class="navbar-link" href="#${name}">${name}</a>
		</li>
		`;
}, "");
document.querySelector('.navbar-list').innerHTML = navBarInnerHtml;

let containersHtml = db.reduce((t,i) => { 
	let name = i['name'];
	return t + `<div class="container hide" id="${name}">${name}</div>`;
}, "");
document.querySelector('.containers').innerHTML = containersHtml;

let containerIds = db.map(e => '#' + e['name']);

document.querySelectorAll('.navbar-link').forEach(navbarLink => navbarLink.addEventListener('click', e => {
	showContainer(containerIds, e.currentTarget.getAttribute('href'))
}));

let requestedUrl = window.location.href.split('/').slice(-1);

showContainer(containerIds, requestedUrl);

function showContainer(containerIds, containerIdToShow) {
	let didShowContainer = false;
	containerIds.forEach(containerId => {
		if (containerId == containerIdToShow) {
			document.querySelector(containerId).classList.remove('hide');
			didShowContainer = true;
		} else {
			document.querySelector(containerId).classList.add('hide');
		}
	});

	if (!didShowContainer) {
		document.querySelector(containerIds[0]).classList.remove('hide');
	}
}