(function () {
    'use strict';

    var intro = document.getElementById('envelope-intro');
    var card = document.querySelector('.envelope-card');
    var seal = document.getElementById('envelope-seal');
    var isEditor = new URLSearchParams(window.location.search).get('edit') === '1';

    if (!intro || !card || !seal) return;

    if (isEditor) {
        intro.remove();
        return;
    }

    document.body.classList.add('envelope-locked');

    seal.addEventListener('click', function () {
        if (card.classList.contains('is-open')) return;

        card.classList.add('is-open');
        intro.classList.add('is-opening');
        seal.setAttribute('aria-disabled', 'true');

        window.setTimeout(function () {
            intro.classList.add('is-hidden');
            document.body.classList.remove('envelope-locked');
        }, 1300);

        window.setTimeout(function () {
            intro.remove();
        }, 2200);
    });
}());
