/**
 * Vigram
 * @version : 2.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

/**
 *
 * @param content
 * @returns {string}
 */
function getUrlFromInstagramMedia(content) {
    var start = content.indexOf('og:video" content="', 0);
    if (start == -1) {
        start = content.indexOf('og:image" content="', 0);
    }
    var end = content.indexOf('"', start + 19);
    return content.substring(start + 19, end);
}

/**
 *
 * @param content
 * @returns bool
 */
function getTypeFromInstagramMedia(content) {
    return content.indexOf('og:video" content="', 0) === -1;
}


/**
 *
 * @param content
 * @returns {string}
 */
function getRealImgFromInstagram(content) {
    var url = getUrlFromInstagramMedia(content);
    var is_pic = getTypeFromInstagramMedia(content);
    if (!is_pic) {
        url = url.replace("s3.amazonaws", "ak.instagram");
        url = url.replace("_6.", "_7.");
    }
    return url;
}

/**
 * .hasClass from jQuery.
 * @param elem
 * @param className
 * @returns {boolean}
 */
function hasClass(elem, className)
{
    var classes = elem.className;
    if (typeof classes === 'undefined')
        return false;
    classes = classes.split(' ');
    if (classes.indexOf(className) !== -1)
        return true;
    return false;
}

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
 * Instagram Modal
 */
document.querySelector('body').addEventListener('click', function() {
    document.querySelector('body').addEventListener('DOMNodeInserted', function(e) {
        e = e ? e : window.event;
        if (document.querySelector('div div .igDialogLayer .VerticalCenter'))
        {
            if (e.target !== 'undefined')
                return;
            var elem = e.target.querySelector('.Item .iMedia .Image') || e.target.querySelector('.Item .iMedia .Video');
            if (elem === null || hasClass(elem, 'Vigram'))
                return;
            var urlToMedia = elem.getAttribute('src'),
                fName = urlToMedia.split('/')[4];

            elem.className += ' Vigram';

            var VigramLink = document.createElement('a');
            VigramLink.className = 'VigramModal';
            VigramLink.style.backgroundImage = "url("+image+")";
            VigramLink.style.zIndex = '5';
            VigramLink.href = urlToMedia;
            VigramLink.setAttribute('download', fName);
            elem.appendChild(VigramLink);
        }
    });
});

/**
 *
 * @param element
 * @returns {HTMLElement}
 */
function getVigramButton(element) {

    var url = element.getAttribute('src');
    var fName = url.split("/")[4];

    var VigramLink = document.createElement('a');
    var VigramButton = document.createElement('span');

    VigramLink.className = "timelineLikeButton";
    VigramLink.style.background = 'url(' + image + ') no-repeat 50% 50%';
    VigramLink.style.backgroundSize = '30px';
    VigramLink.href = url;
    VigramLink.setAttribute('download', fName);
    VigramLink.appendChild(VigramButton);

    return VigramLink;
}

/**
 *
 * @param element
 * @param appendTo
 */
function getVigramButtonProfile(element, appendTo) {

    var realUrl = element.href.replace('http://', 'https://');
    ajax('GET', realUrl, function(content, index) {
        var url = getUrlFromInstagramMedia(content);
        var fName = url.split("/")[4];

        var VigramContainer = document.createElement('li');
        var VigramLink = document.createElement('a');
        var VigramButton = document.createElement('img');

        VigramContainer.classList.add('VigramProfileButton');
        VigramButton.classList.add('size20');
        VigramButton.src = image;
        VigramLink.href = url;
        VigramLink.setAttribute('download', fName);

        VigramLink.appendChild(VigramButton);
        VigramContainer.appendChild(VigramLink);

        appendTo.appendChild(VigramContainer);
    });
}

/**
 *
 * @param elem
 */
function            setButton(elem)
{
    var button = getVigramButton(elem);

    var commentNode = elem.parentNode.nextSibling;
    if (!commentNode)
        commentNode = elem.parentNode.parentNode.nextSibling;

    if (!!commentNode)
    {
        if (commentNode.className.indexOf('timelineLikes') !== -1)
        {
            commentNode.insertBefore(button, commentNode.querySelectorAll('.timelineLikeButton')[0]);
        }
    }
    elem.classList.add('Vigram');
}

/**
 *
 * @param element
 * @returns {boolean}
 */
function            isMedias(element)
{
    var classlist = element.classList;
    if (element.localName !== 'div')
        return false;

    if (!classlist.contains('Image') && !classlist.contains('Video')
        || classlist.contains('timelineBookmarkAvatar')
        || classlist.contains('timelineCommentAvatar')
        || classlist.contains('Vigram'))
        return false;

    if (!element.getAttribute('src'))
        return false;

    return true;
}

/**
 *
 * @param element
 */
function        setButtonOnProfile(element)
{
    if (element.nextSibling.classList.contains('vigram'))
        return;

    if (element.parentNode.classList.contains('tVideo'))
    {
        var urlFromModal = element.parentNode.parentNode.href;
        ajax('GET', urlFromModal, function(content, index) {
            var url = getUrlFromInstagramMedia(content);
            var fName = url.split("/")[4];

            var VigramContainer = document.createElement('li');
            var VigramLink = document.createElement('a');
            var VigramButton = document.createElement('img');

            VigramContainer.classList.add('VigramProfileButton');
            VigramButton.classList.add('size20');
            VigramButton.src = image;
            VigramLink.href = url;
            VigramLink.setAttribute('download', fName);

            VigramLink.appendChild(VigramButton);
            VigramContainer.appendChild(VigramLink);

            element.parentNode.parentNode.nextSibling.firstChild.appendChild(VigramContainer);
        });
    }
    else {
        getVigramButtonProfile(element, element.nextSibling.firstChild);
    }
    element.nextSibling.classList.add('vigram');
}

/**
 * Instagram - Single page.
 * @param singlePage
 */
function    instagramSingle(singlePage)
{
    if (typeof singlePage !== 'undefined')
    {
        ajax('GET', null, function(content, index) {
            var url = getUrlFromInstagramMedia(content);
            if (typeof url === 'undefined')
                return;

            var fName = url.split("/")[3];
            if (typeof fName === 'undefined' || fName === 'profiles')
                return;

            var is_pic = getTypeFromInstagramMedia(content);
            var text_button = chrome.i18n.getMessage("dl_button_vid");
            if (is_pic)
                text_button = chrome.i18n.getMessage("dl_button_pic");

            var topbar = document.querySelectorAll('.top-bar-actions')[0];
            if (typeof topbar !== 'undefined')
            {
                if (!topbar.querySelector('#VigramSingleImg'))
                {
                    var VigramList = document.createElement('li'),
                        VigramLink = document.createElement('a'),
                        VigramSpan = document.createElement('span'),
                        VigramButton = document.createElement('img'),
                        VigramText = document.createElement('strong');

                    VigramList.id = "VigramSingleImg";
                    VigramList.style.width = '225px';

                    VigramLink.href = url;
                    VigramLink.setAttribute('download', fName);

                    VigramSpan.style.float = 'left';
                    VigramSpan.style.display = 'inline';
                    VigramSpan.style.margin = '-4px 7px 1px 0px';

                    VigramButton.src = image;

                    VigramText.innerHTML = text_button;
                    VigramText.style.display = 'block';

                    VigramSpan.appendChild(VigramButton);
                    VigramLink.appendChild(VigramSpan);
                    VigramLink.appendChild(VigramText);
                    VigramList.appendChild(VigramLink);
                    topbar.appendChild(VigramList);
                }
            }
        });
    }
}

/**
 *
 */
window.addEventListener('mousemove', function(e) {
    if (e.target.classList.contains('pgmiImageLinkFocussed'))
    {
        setButtonOnProfile(e.target);
    }
});

/**
 *
 */
window.addEventListener('DOMNodeInserted', function(e) {
    if (document.URL.search('/p/') !== -1 && !document.querySelector('div div .igDialogLayer .VerticalCenter'))
        instagramSingle(document.querySelectorAll('.lbAnimation')[0]);
    else
    {
        var elem = document.getElementById('VigramSingleImg');
        if (elem)
        {
            elem.remove();
        }
    }
});

/**
 *
 */
window.addEventListener('DOMSubtreeModified', function(e) {

    var element = e.target;
    if (isMedias(element))
    {
        setButton(element);
    }
});
