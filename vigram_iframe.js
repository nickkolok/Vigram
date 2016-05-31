console.log('[Vigram] iframe script started');

var VigramLogo = chrome.extension.getURL("medias/images/vigram_48.png");


/**
 *
 * @param metas
 * @returns {HTMLElement}
 */
function createVigramButton(metas) {
    var VigramLink = document.createElement('a');
    var VigramButton = document.createElement('span');

    VigramLink.className = "VigramButton _ebwb5 _1tv0k _345gm";
    VigramLink.style.background = 'url(' + VigramLogo + ') no-repeat 50% 50%';
    VigramLink.style.backgroundSize = '30px';
    VigramLink.style.display = "block";
    VigramLink.style.height = "50px";
    VigramLink.style.width = "50px";
    VigramLink.href = metas.url;
    VigramLink.setAttribute('download', metas.name);
    VigramLink.appendChild(VigramButton);

    return VigramLink;
}



(function(){
	if(/\.(jpg|mp4)$/.test(document.location.href)){
		return;
	}
	var json=JSON.parse(document.location.hash.replace(/^#/,''));
	document.body.innerHTML='';
	document.body.style.padding=0;
	document.body.style.margin=0;
	document.body.appendChild(createVigramButton(json));
})();


console.log('[Vigram] iframe script finished');
