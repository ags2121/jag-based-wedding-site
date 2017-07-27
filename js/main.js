let navBarInnerHtml = db.reduce((t,i) => { 
	let name = i['name']; 
	return t + `
		<li class="navbar-item">
			<a class="navbar-link" href="#${name}">${name}</a>
		</li>
		`;
	}, "");
document.querySelector('.navbar-list').innerHTML = navBarInnerHtml;
