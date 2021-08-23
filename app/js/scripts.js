

console.log('[READY]');

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

	options = {
		path: '/',
		// при необходимости добавьте другие значения по умолчанию
		...options
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += "; " + optionKey;
		let optionValue = options[optionKey];
		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
		'max-age': -1
	})
}

const giphyAPIUri = 'https://api.giphy.com/v1/gifs/';
const giphyToken = 'fddOYO9tcr0XbAeEHFOTW8fik5Jh9bMw';
const giphyLimit = 8;

const giphyContainer = document.getElementById('giphyContainer');

setCookie('limit', giphyLimit);

// Trending Request Func
async function toGiphyRequest(apiKey, limit) {

	deleteCookie('giphyQuery');
	setCookie('limit', limit);
	let dataRes = await fetch(giphyAPIUri + 'trending?api_key=' + apiKey + '&limit=' + limit);
	let dataFormated = await dataRes.json();

	console.log(dataFormated);



	return dataFormated;
}

// Search Request Func
async function toGiphySearchRequest(apiKey, query, limit) {

	setCookie('giphyQuery', query);
	setCookie('limit', limit);

	let dataRes = await fetch(giphyAPIUri + 'search?api_key=' + apiKey + '&q=' + query + '&limit=' + limit);
	let dataFormated = await dataRes.json();



	return dataFormated;
}

// Generating columns of gifs
function htmlGenerating(data, showmore) {
	

	if(showmore) {
		data.forEach((item, index) => {
			console.log(index, parseInt(getCookie('limit')));
			if(index >= (parseInt(getCookie('limit'))) - 8) {
				giphyContainer.innerHTML = giphyContainer.innerHTML + `<div class="col-3 giphy__item">
				<a target="_blank" href="${item.bitly_gif_url}" class="giphy__item-content"><img src="${item.images.downsized.url}" alt="gif" /></a>
				</div>` ;
			}
		})
	} else {
		data.forEach((item, index) => {
			giphyContainer.innerHTML = giphyContainer.innerHTML + `<div class="col-3 giphy__item">
				<a target="_blank" href="${item.bitly_gif_url}" class="giphy__item-content"><img src="${item.images.downsized.url}" alt="gif" /></a>
				</div>` ;
		})
	}
}


async function loadMoreGIFs() {
	if (getCookie('giphyQuery')) {
		toGiphySearchRequest(giphyToken, getCookie('giphyQuery'), parseInt(getCookie('limit')) + 8).then(dataStart => {
			console.log(dataStart);

			htmlGenerating(dataStart.data, true);
		})
	} else {
		toGiphyRequest(giphyToken, parseInt(getCookie('limit')) + 8).then(dataStart => {
			console.log(dataStart);

			htmlGenerating(dataStart.data, true);
		})
	}
}




const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function (e) {
	e.preventDefault();
	let input = searchForm.querySelector('input');
	giphyContainer.innerHTML = '';

	if (input.value) {
		toGiphySearchRequest(giphyToken, input.value, giphyLimit).then(dataStart => {
			console.log(dataStart);

			htmlGenerating(dataStart.data);
		})
	} else {
		toGiphyRequest(giphyToken, giphyLimit).then(dataStart => {
			console.log(dataStart);

			htmlGenerating(dataStart.data);
		})
	}

});

const giphyShowmoreBtn = document.querySelector('.giphy__showmore');
giphyShowmoreBtn.addEventListener('click', function() {
	loadMoreGIFs();
})


toGiphyRequest(giphyToken, giphyLimit).then(dataStart => {
	console.log(dataStart);

	htmlGenerating(dataStart.data);
})







//# sourceMappingURL=scripts.js.map
