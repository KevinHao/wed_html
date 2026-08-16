(function () {
    'use strict';

    var section = document.getElementById('scratch-date');
    if (!section) return;

    var cards = Array.prototype.slice.call(section.querySelectorAll('.scratch-card'));
    var result = section.querySelector('.scratch-result');
    var revealedCount = 0;

    function paintCover(canvas) {
        var rect = canvas.getBoundingClientRect();
        var width = Math.max(1, Math.round(rect.width));
        var height = Math.max(1, Math.round(rect.height));
        var ratio = Math.min(window.devicePixelRatio || 1, 2);
        var context = canvas.getContext('2d');

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        var gradient = context.createRadialGradient(width * .28, height * .2, 2, width * .55, height * .55, width * .78);
        gradient.addColorStop(0, '#fff8c9');
        gradient.addColorStop(.22, '#f2cf72');
        gradient.addColorStop(.55, '#c18a32');
        gradient.addColorStop(.8, '#f5dc88');
        gradient.addColorStop(1, '#9d641d');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        var shine = context.createLinearGradient(0, 0, width, height);
        shine.addColorStop(0, 'rgba(255, 255, 255, .42)');
        shine.addColorStop(.35, 'rgba(255, 255, 255, 0)');
        shine.addColorStop(.7, 'rgba(255, 255, 255, .12)');
        shine.addColorStop(1, 'rgba(116, 64, 12, .2)');
        context.fillStyle = shine;
        context.fillRect(0, 0, width, height);

        context.globalAlpha = .28;
        context.strokeStyle = '#fff4be';
        context.lineWidth = 1;
        for (var ring = 18; ring < Math.min(width, height) / 2; ring += 14) {
            context.beginPath();
            context.arc(width / 2, height / 2, ring, 0, Math.PI * 2);
            context.stroke();
        }
        context.globalAlpha = .72;
        var sparkles = [[.23, .25, 4], [.72, .2, 3], [.78, .7, 4], [.3, .78, 2]];
        sparkles.forEach(function (sparkle) {
            var sx = width * sparkle[0];
            var sy = height * sparkle[1];
            var size = sparkle[2];
            context.fillStyle = '#fff8d5';
            context.beginPath();
            context.moveTo(sx, sy - size * 2);
            context.lineTo(sx + size * .55, sy - size * .55);
            context.lineTo(sx + size * 2, sy);
            context.lineTo(sx + size * .55, sy + size * .55);
            context.lineTo(sx, sy + size * 2);
            context.lineTo(sx - size * .55, sy + size * .55);
            context.lineTo(sx - size * 2, sy);
            context.lineTo(sx - size * .55, sy - size * .55);
            context.closePath();
            context.fill();
        });
        context.globalAlpha = 1;
    }

    function getPoint(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function erase(card, event) {
        var canvas = card.querySelector('.scratch-canvas');
        var context = canvas.getContext('2d');
        var point = getPoint(canvas, event);

        context.save();
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(point.x, point.y, 23, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    function checkProgress(card) {
        var canvas = card.querySelector('.scratch-canvas');
        var context = canvas.getContext('2d');
        var pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        var step = 8;
        var total = 0;
        var cleared = 0;

        for (var y = 3; y < canvas.height; y += step) {
            for (var x = 3; x < canvas.width; x += step) {
                var alpha = pixels[(y * canvas.width + x) * 4 + 3];
                total += 1;
                if (alpha < 100) cleared += 1;
            }
        }

        if (cleared / total >= .48) reveal(card);
    }

    function reveal(card) {
        if (card.classList.contains('is-revealed')) return;
        card.classList.add('is-revealed');
        revealedCount += 1;

        if (revealedCount === cards.length) {
            result.classList.add('is-complete');
            result.setAttribute('aria-hidden', 'false');
        }
    }

    function bindCard(card) {
        var canvas = card.querySelector('.scratch-canvas');
        var isScratching = false;
        var lastCheck = 0;

        paintCover(canvas);

        canvas.addEventListener('pointerdown', function (event) {
            if (card.classList.contains('is-revealed')) return;
            isScratching = true;
            card.classList.add('is-scratching');
            canvas.setPointerCapture(event.pointerId);
            erase(card, event);
            event.preventDefault();
        });

        canvas.addEventListener('pointermove', function (event) {
            if (!isScratching) return;
            erase(card, event);
            if (event.timeStamp - lastCheck > 120) {
                lastCheck = event.timeStamp;
                checkProgress(card);
            }
            event.preventDefault();
        });

        function stopScratching(event) {
            if (!isScratching) return;
            isScratching = false;
            card.classList.remove('is-scratching');
            checkProgress(card);
            if (canvas.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        }

        canvas.addEventListener('pointerup', stopScratching);
        canvas.addEventListener('pointercancel', stopScratching);
        canvas.addEventListener('lostpointercapture', function () {
            isScratching = false;
            card.classList.remove('is-scratching');
        });
    }

    cards.forEach(bindCard);

    window.addEventListener('resize', function () {
        cards.forEach(function (card) {
            if (!card.classList.contains('is-revealed')) paintCover(card.querySelector('.scratch-canvas'));
        });
    });
}());