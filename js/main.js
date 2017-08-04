// Views
let createTieredTextVideo = (videos) => {
	let i = 0;
	return videos.map(video => {
		let description = video['description'];
		let thumbnail = video['thumbnail'];
		let thumbnailHtml =
			`
			<li class="one-half column" data-media="">
				<img src="assets/${thumbnail}"/>
			</li>
			`;
		let descriptionHtml = 
			`	
			<li class="one-half column" data-media="">
				<div class="description">${description}</div>
			</li>
			`;
		let videoHtml = ++i % 2 ? thumbnailH + descriptionHtml : descriptionHtml + thumbnailHtml;						
		return '<div class="row"><ul class="media-list">' + videoHtml + '</ul></div>';
	}).join('');
};

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

let containersHtml = db.reduce((t, page) => { 
	let name = page['name'];
	let body = page['type'] == 'tiered_text_video' ? createTieredTextVideo(page['media']) : name;
	return t + `<div class="container hide ${name}">${body}</div>`;
}, "");
document.querySelector('.containers').innerHTML = containersHtml;

let containerIds = db.map(e => e['name']);

document.querySelectorAll('.navbar-link').forEach(navbarLink => navbarLink.addEventListener('click', e => {
	showContainer(containerIds, e.currentTarget.getAttribute('href').replace('#',''));
}));

let requestedUrl = window.location.href.split('/').slice(-1)[0].replace('#','');

showContainer(containerIds, requestedUrl);

function showContainer(containerIds, containerIdToShow) {
	let didShowContainer = false;
	containerIds.forEach(containerId => {
		if (containerId == containerIdToShow) {
			document.querySelector(`.container.${containerId}`).classList.remove('hide');
			didShowContainer = true;
		} else {
			document.querySelector(`.container.${containerId}`).classList.add('hide');
		}
	});

	if (!didShowContainer) {
		let containerId = containerIds[0];
		document.querySelector(`.container.${containerId}`).classList.remove('hide');
	}
}

// Utility funcs
function partition(array, n) {
	return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}