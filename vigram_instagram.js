/**
 * Vigram
 * @version : 2.2
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var VigramLogo = chrome.extension.getURL("medias/images/vigram_48.png");



/**
 *
 * @returns String
 */
function getAuthor(article) {
	if(!article)
		article = document.querySelector('article');
	try{
		return document.querySelectorAll('a._ook48')[0].innerHTML;
	}catch(e){
		console.log('Author unknown');
		console.error(e);
		console.log(querySelectorAll('a._ook48'));
		return "author_unknown";
	}
}

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

/**
 *
 * @param element
 * @returns {HTMLElement}
 */
function getVigramButton(element) {

    var media = element.querySelector('img');
    if (!media)
      media = element;

    if (media.tagName !== 'IMG' && media.tagName !== 'VIDEO')
      return null;

    var metas = {
        url: media.getAttribute('src')
    };

    return createVigramButton({
		url: metas.url,
		name: getAuthor() + "__" + metas.url.split("/")[4],
	});
}

function            isMediaBlock(node) {
    return !!node.classList.contains('ResponsiveBlock') ||
      !!(node.classList.contains('_22yr2') && !node.parentNode.classList.contains('ResponsiveBlock'));
}

/**
 *
 * @param elem
 */
function            setButton(elem)
{
    if (elem.classList.contains('Vigram') && elem.offsetWidth !== 600)
      return;

    var button = getVigramButton(elem);
    if (!button)
        return;

    var node = elem;
    while (node.tagName !== 'ARTICLE')
        node = node.parentNode;

	// Getting the author's nickname
	var author = node.querySelector('header > a').href.split('/')[3];
	console.log("Vigram: author's nickname: " + author);

    var commentNode = node.children[node.children.length - 1];
    if (!!commentNode && !commentNode.classList.contains('Vigram')) {
      commentNode.className += " Vigram";
      var addCommentSection = commentNode.querySelectorAll('._jveic')[0],
          lovelyHearth = commentNode.querySelectorAll('._ebwb5._1tv0k')[0];
        if (!!addCommentSection && !!lovelyHearth) {
            addCommentSection.insertBefore(button, lovelyHearth);
        }
    } else if (!!commentNode) {
      var oldNode = commentNode.querySelectorAll('.VigramButton')[0];
      if (!oldNode)
        return;

      if (oldNode.href === button.href)
        return;

      var commentNodeRef = oldNode.parentNode;
      commentNodeRef.replaceChild(button, commentNodeRef.querySelectorAll('.VigramButton')[0]);
    } else {

        return;
    }

    elem.classList.add('Vigram');
}

/**
 *
 */
document.body.addEventListener('DOMSubtreeModified', function(e) {
	vigramize();
 /*
    var medias = document.querySelectorAll('._jjzlb, video');
    for (var k = 0; k < medias.length; k++) {
        setButton(medias[k]);
    }
*/
},false);

//document.body.addEventListener('click',vigramize);

function vigramize() {
	var articles = document.getElementsByTagName('article');
	for(var i = 0; i < articles.length; i++){
		if(!articles[i].getAttribute("data-vigramized")){
			setInterval(function(){vigramizeArticle(articles[i]);},1468);
			articles[i].setAttribute("data-vigramized",1);
		}else{
			console.log("Article is already vigramized:");
			console.log(articles[i]);
		}
	}
}

function getArticleURL(article){
		var videos = article.querySelectorAll('video');
		if(videos && videos[0] && videos[0].src){
			return videos[0].src;
		}

		var possibleURLcontainers=article.querySelectorAll('div');
		var encodedURL,decodedURL;
		for(var i = 0; (i < possibleURLcontainers.length) && !decodedURL; i++){
			encodedURL = possibleURLcontainers[i].getAttribute('data-reactid');
			if(encodedURL)
				decodedURL=decodeInstagramURL_safe(encodedURL);
		}
		return decodedURL;
}


function vigramizeArticle(article) {
	try{
		if(!article){
			return;
		}
		var existingButtons = article.querySelectorAll('.VigramButton');
		var author = getAuthor();
		var decodedURL=getArticleURL(article);
//		if(existingButtons.length)
//			return;

		for(var j=0; existingButtons.length && j<existingButtons.length; j++){
			if(
				existingButtons[j].getAttribute("data-url") == decodedURL
			&&
				existingButtons[j].getAttribute("data-author") == author
			){
				return;
			}
			existingButtons[j].remove();
		}

//		possibleURLcontainers[i].addEventListener('DOMSubtreeModified',function(){vigramizeArticle(article)},false);
/*
		var vigramButton = createVigramButton({
			url: decodedURL,
			name: getAuthor() + "__" + decodedURL.split("/")[5], // Currently not working in Chrome :(
		});
*/
		var vigramButton = document.createElement('iframe');
		vigramButton.src="https://"+decodedURL.split("/")[2]+"/"+Math.random()+".html#"+JSON.stringify({
			url: decodedURL,
			name: author + "__" + decodedURL.split("/")[5],
		});
		vigramButton.width="50";
		vigramButton.height="50";
		vigramButton.className="VigramButton";
		vigramButton.setAttribute("data-url",decodedURL);
		vigramButton.setAttribute("data-author",author);

		vigramButton.style.position = "absolute";
		vigramButton.style.right = "-60px";
		vigramButton.style.top = "0";
		article.appendChild(vigramButton);
	}catch(e){
		console.log("Cannot vigramize article:");
		console.log(article);
		console.error(e);
	}
}

function decodeInstagramURL(url) {
	var u = url.match(/https.*(jpg|mp4)/)[0];
	u=u.replace(/=1/g,".").replace(/=2/g,":");
	return u;
}

function decodeInstagramURL_safe(url) {
	try{
		var u = decodeInstagramURL(url);
		console.log("Decoded Instagram URL:\n" + u);
		return u;
	}catch(e){
		console.log("Unable to decode Instagram URL:\n" + url);
		return null;
	}
}

console.log('Vigram for Instagram loaded!');
