
// Views

let videoView = `
	<div class="video-container">
		<iframe width="560" height="315" src="" frameborder="0" allowfullscreen></iframe>
	</div>
`;

let photoView = `
	<div class="photo-container">
		<img src=""/>
	</div>
`;

let createImageView = (mediaType, thumbnail, url) => {
	return `
		<a> <img class="${mediaType ? 'thumbnail' : ''}" src="assets/${thumbnail}" data-media="${url}" /></a>
	`;
};

let createPopUpView = (mediaType) => {
	if (!mediaType) {
		return '';
	}

	let innerContainer = mediaType == "video" ? videoView : photoView;
	return `
		<div class="popup hide">
			<div class="close"><a>&#10005;</a></div>
			<div class="outer-container">
				${innerContainer}
			</div>
			<div class="arrow left"></div>
      		<div class="arrow right"></div>
		</div>
	`;
};

let createOneColumnTieredTextMediaView = (media) => {
	let medias = media['data'];
	let i = 0;
	let mediaType = media['media_type'];

	return medias.map(media => {
		let description = media['description'];
		let thumbnail = media['thumbnail'];
		let thumbnailHtml =
			`
			<li class="one-half column">
				${createImageView(mediaType, thumbnail, media['media']['url'])}
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
	}).join('') + createPopUpView(mediaType);
};

let createTwoColumnTextMediaView = (media) => {
	let medias = media['data'];
	let mediaType = media['media_type'];

	return partition(medias.slice(), 2).map(mediasForRow => {
		return mediasForRow.reduce((t, media) => {
			let description = media['description'];
			let thumbnail = media['thumbnail'];

			return t +
				`	
				<li class="one-half column" data-media="">
					<a> <img class="${mediaType ? 'thumbnail' : ''}" src="assets/${thumbnail}" data-media="${media['media']['url']}" /></a>
					<div class="description">${description}</div>
				</li>
				`;

		}, '<div class="row "><ul class="media-list">') + '</ul></div>';
	}).join('') + createPopUpView(mediaType);
};

let createTextView = (media) => {
	let texts = media['data'];
	return texts.map(text => `<div class="row text"><div class="column">${text}</div></div>`).join('');
};

let viewFunctionLookup = {
	'one_column_tiered_text_media': createOneColumnTieredTextMediaView,
	'two_column_text_media': createTwoColumnTextMediaView,
	'text': createTextView
};

let createPageView = (pageViewData) => {
	let name = pageViewData['name'];
	let body = viewFunctionLookup[pageViewData['type']](pageViewData);
	return `<div class="container hide ${name}" data-name=${name}>${body}</div>`;
};

let createNavbarView = (db) => {
	return db.reduce((t, pageViewData) => { 
		let name = pageViewData['name']; 
		return t + 
			`
			<li class="navbar-item">
				<a class="navbar-link" href="#${name}">${name}</a>
			</li>
			`;
	}, "");
};


// Create Views

document.querySelector('.navbar-list').innerHTML = createNavbarView(db);

let containersHtml = db.reduce((t, page) => { 
	return t + createPageView(page);
}, "");
document.querySelector('.containers').innerHTML = containersHtml;

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

let containerIds = db.map(e => e['name']);
let requestedUrl = window.location.href.split('/').slice(-1)[0].replace('#','');

showContainer(containerIds, requestedUrl);

// Event handlers

document.querySelectorAll('.navbar-link').forEach(navbarLink => navbarLink.addEventListener('click', e => {
	showContainer(containerIds, e.currentTarget.getAttribute('href').replace('#',''));
}));

function setPopupMedia(popup, url) {
  var matchingElements = [];
  var allElements = popup.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute('src') !== null) {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  matchingElements[0].setAttribute('src', url);
}

let disableThumbnailsInContainer = (container) => {
	container.querySelectorAll('img').forEach(i => { i.style.pointerEvents = 'none'; })
};

let reenableThumbnailsInContainer = (container) => {
	container.querySelectorAll('img').forEach(i => { i.style.pointerEvents = 'auto'; })
};

document.querySelectorAll('.thumbnail').forEach(t => {
	t.addEventListener('click', e => {
		let popup = e.currentTarget.closest('.container').querySelector('.popup');
		let url = e.currentTarget.getAttribute('data-media');
		setPopupMedia(popup, url);
		popup.classList.remove('hide');
		disableThumbnailsInContainer(popup.closest('.container'));
	});
});

document.querySelectorAll('.close').forEach(close => {
	close.addEventListener('click', e => {
		let popup = e.currentTarget.closest('.popup')
		popup.classList.add('hide');
		setPopupMedia(popup, '');
		reenableThumbnailsInContainer(popup.closest('.container'));
	});
});

function slidePopup(popup, doSlideLeft) { 
	popup.closest('.container')
	var currentImage = document.querySelectorAll('.carousel .artist-image')[index];
	if (doSlideLeft) {
		index--;
		if (index < 0) {
			index = artists.length-1;
		}
	} else {
		index++;
		if (index > artists.length-1) {
			index = 0;
		}
	}
};

document.querySelectorAll('.arrow').forEach(a => {
	a.addEventListener('click', e => {
		e.preventDefault();
		let doSlideLeft = e.currentTarget.classList.contains('left');
		let popup = e.currentTarget.closest('.popup');
		slidePopup(popup, doSlideLeft);
	});
});

// Utility funcs
function partition(array, n) {
	return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}