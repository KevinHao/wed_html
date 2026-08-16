(function () {
    'use strict';

    var elements = Array.prototype.slice.call(document.querySelectorAll('.scroll-reveal, .timeline-item-reveal'));
    if (!elements.length) return;

    function showAll() {
        elements.forEach(function (element) {
            element.classList.add('is-visible');
        });
    }

    if (!('IntersectionObserver' in window)) {
        showAll();
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, {
        threshold: .14,
        rootMargin: '0px 0px -8% 0px'
    });

    elements.forEach(function (element) {
        observer.observe(element);
    });
}());