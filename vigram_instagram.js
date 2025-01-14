/**
 * Vigram
 * @version : 2.2
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var VigramLogo = chrome.extension.getURL("medias/images/vigram_48.png");

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
    metas.name = metas.url.split("/")[4]

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
window.addEventListener('DOMSubtreeModified', function(e) {

    var medias = document.querySelectorAll('._jjzlb, video');
    for (var k = 0; k < medias.length; k++) {
        setButton(medias[k]);
    }
});
