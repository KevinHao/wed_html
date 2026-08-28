(function () {
    'use strict';

    var intro = document.getElementById('envelope-intro');
    var card = document.querySelector('.envelope-card');
    var opener = document.getElementById('envelope-open-button');
    var preloader = document.getElementById('preloader-active');
    var isEditor = new URLSearchParams(window.location.search).get('edit') === '1';

    if (!intro || !card || !opener) return;

    if (isEditor) {
        intro.remove();
        return;
    }

    document.body.classList.add('envelope-locked');

    function removeIntro() {
        if (intro.parentNode) intro.remove();
    }

    function hidePreloader() {
        if (preloader) preloader.style.display = 'none';
    }

    intro.addEventListener('transitionend', function (event) {
        if (event.target === intro && event.propertyName === 'opacity' && intro.classList.contains('is-hidden')) {
            removeIntro();
        }
    });

    opener.addEventListener('click', function () {
        if (opener.disabled) return;

        opener.disabled = true;
        hidePreloader();
        card.classList.add('is-opening');
        intro.classList.add('is-opening');

        window.setTimeout(function () {
            intro.classList.add('is-hidden');
            document.body.classList.remove('envelope-locked');
        }, 2400);

    });
}());
