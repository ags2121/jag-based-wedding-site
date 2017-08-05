
// Views
let popupView = `<div class="popup hide"> <img src='assets/foo_thumb.png' /> </div>`;

let createOneColumnTieredTextMediaView = (medias) => {
	let i = 0;
	return medias.map(media => {
		let description = media['description'];
		let thumbnail = media['thumbnail'];
		let thumbnailHtml =
			`
			<li class="one-half column" data-media="">
				<img class="thumbnail" src="assets/${thumbnail}"/>
			</li>
			`;
		let descriptionHtml = 
			`	
			<li class="one-half column" data-media="">
				<div class="description">${description}</div>
			</li>
			`;
		let mediaHtml = ++i % 2 ? thumbnailHtml + descriptionHtml : descriptionHtml + thumbnailHtml;						
		return '<div class="row tiered"><ul class="media-list">' + mediaHtml + '</ul></div>';
	}).join('') + popupView;
};

let createTwoColumnTextMediaView = (medias) => {
	return partition(medias.slice(), 2).map(mediasForRow => {
		return mediasForRow.reduce((t, media) => {
			let description = media['description'];
			let thumbnail = media['thumbnail'];

			return t +
				`	
				<li class="one-half column" data-media="">
					<img class="thumbnail" src="assets/${thumbnail}"/>
					<div class="description">${description}</div>
				</li>
				`;

		}, '<div class="row "><ul class="media-list">') + '</ul></div>';
	}).join('') + popupView;
};

let createTextView = (texts) => {
	return texts.map(text => `<div class="row text"><div class="column">${text}</div></div>`).join('');
};

let viewFunctionLookup = {
	'one_column_tiered_text_media': createOneColumnTieredTextMediaView,
	'two_column_text_media': createTwoColumnTextMediaView,
	'text': createTextView
}

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
	let body = viewFunctionLookup[page['type']](page['data']);
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

// Event handlers
document.querySelectorAll('.thumbnail').forEach(t => {
	t.addEventListener('click', e => {
		let popup = e.currentTarget.closest('.container').querySelector('.popup');
		popup.classList.remove('hide');
	});
});

// Utility funcs
function partition(array, n) {
	return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}