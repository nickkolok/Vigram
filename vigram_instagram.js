/**
 * Vigram
 * @version : 2.2
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

/**
 * AJAX call.
 * @param verb
 * @param url
 * @param cb
 */
function    ajax(verb, url, cb, index)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(url) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            return cb(xmlhttp.responseText, index);
    };
    if (url === null)
        url = '';
    xmlhttp.open(verb, url, true);
    xmlhttp.send();
}

/**
 *
 * @param element
 * @returns {HTMLElement}
 */
function getVigramButton(element) {


    if (element.tagName !== 'IMG' && !element.hasAttribute('src')) {
        return null;
    }

    var url = element.getAttribute('src');
    var fName = url.split("/")[4];

    var VigramLink = document.createElement('a');
    var VigramButton = document.createElement('span');

    VigramLink.className = "VigramButton -cx-PRIVATE-PostInfo__likeButton -cx-PRIVATE-LikeButton__root -cx-PRIVATE-Util__hideText";
    VigramLink.style.background = 'url(' + image + ') no-repeat 50% 50%';
    VigramLink.style.backgroundSize = '30px';
    VigramLink.style.display = "block";
    VigramLink.style.height = "50px";
    VigramLink.style.width = "50px";
    VigramLink.href = url;
    VigramLink.setAttribute('download', fName);
    VigramLink.appendChild(VigramButton);

    return VigramLink;
}

/**
 *
 * @param elem
 */
function            setButton(elem)
{
    var button = getVigramButton(elem);
    if (!button)
        return;

    var commentNode = elem.parentNode.parentNode.nextSibling;

    if (!commentNode) {
        // C'est une vidéo
        commentNode = elem.parentNode.parentNode.parentNode.parentNode.nextSibling;
    }
    else if (commentNode.classList.contains('-cx-PRIVATE-PhotoWithUserTags__photo') ||
        commentNode.classList.contains('-cx-PRIVATE-PhotoWithUserTags__tagMeasurementLayer')) {
        // C'est une photo avec un layer.
        commentNode = elem.parentNode.parentNode.parentNode.nextSibling;
    }

    if (!!commentNode && !commentNode.classList.contains('Vigram') &&
        typeof commentNode.querySelectorAll('.-cx-PRIVATE-PostInfo__feedback')[0] != 'undefined') {
        commentNode.className += " Vigram";
        commentNode.querySelectorAll('.-cx-PRIVATE-PostInfo__feedback')[0].insertBefore(button, commentNode.querySelectorAll('.-cx-PRIVATE-PostInfo__likeButton')[0]);
    }

    elem.classList.add('Vigram');
}

/**
 *
 */
window.addEventListener('DOMSubtreeModified', function(e) {

    var medias = document.querySelectorAll('.-cx-PRIVATE-Photo__image, video');
    for (var k = 0; k < medias.length; k++) {
        setButton(medias[k]);
    }
});
