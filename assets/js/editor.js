(function ($) {
  'use strict';

  var editMode = new URLSearchParams(window.location.search).get('edit') === '1';
  var storageKey = 'wedding-page-editor-v1';
  var selected = null;
  var dragging = null;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (error) { saved = {}; }

  var textTargets = [
    ['hero-date', '.hero__caption span'], ['hero-name', '.hero__caption h1'],
    ['hero-subtitle', '.hero__caption p'], ['invite-heading', '.invite-heading'],
    ['invite-month', '.invite-month'], ['invite-day', '.invite-date strong'],
    ['invite-year', '.invite-year'], ['invite-detail', '.invite-details li'],
    ['calendar-title', '.invite-calendar h3'], ['section-title', '.section-tittle h2'],
    ['section-copy', '.section-tittle p'], ['card-title', '.single-card h4'],
    ['card-item', '.single-card li'], ['card-button', '.single-card a'],
    ['venue-title', '.venue-title'], ['venue-copy', '.venue-copy'],
    ['venue-button', '.venue-link'],
    ['dress-title', '.dress-title'], ['dress-copy', '.dress-description'],
    ['parking-title', '.parking-title'], ['parking-copy', '.parking-description'],
    ['gift-title', '.gift-caption h2'], ['gift-copy', '.gift-caption p'],
    ['footer-title', '.footer-tittle h4'], ['footer-item', '.footer-tittle li']
  ];
  var dragTargets = [
    ['hero', '.slider-area'], ['story', '#story'],
    ['countdown', '#countdown'], ['gallery', '#gallery'], ['venue', '.venue-area'],
    ['dress', '#dress-code'], ['parking', '#parking'], ['gift', '.gift-area'],
    ['brands', '.brand-area'], ['gallery-strip', '.gallery-area2'],
    ['footer', '.footer-main'], ['image', 'main img, footer img']
  ];

  function mark(targets, attribute) {
    $.each(targets, function (_, target) {
      $(target[1]).each(function (index) {
        var id = target[0] + '-' + index;
        $(this).attr('data-editor-id', id).attr(attribute, 'true');
      });
    });
  }
  function transform(el, x, y) { el.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; }
  function position(el) {
    var value = window.getComputedStyle(el).transform;
    if (!value || value === 'none') return { x: 0, y: 0 };
    var parts = value.match(/matrix\(([^)]+)\)/);
    if (!parts) return { x: 0, y: 0 };
    parts = parts[1].split(',');
    return { x: parseFloat(parts[4]) || 0, y: parseFloat(parts[5]) || 0 };
  }
  function apply(el) {
    var item = saved[el.getAttribute('data-editor-id')];
    if (!item) return;
    if ($(el).is('[data-editor-text]') && item.html !== undefined) el.innerHTML = item.html;
    if (item.x !== undefined) transform(el, item.x, item.y || 0);
    if (item.width !== undefined) el.style.width = item.width;
    if (item.height !== undefined) el.style.height = item.height;
    if (item.fontSize !== undefined) el.style.fontSize = item.fontSize;
    if (item.color) el.style.color = item.color;
  }
  function colorHex(color) {
    var match = color.match(/\d+/g);
    if (!match) return '#333333';
    return '#' + $.map(match.slice(0, 3), function (v) { return ('0' + parseInt(v, 10).toString(16)).slice(-2); }).join('');
  }
  function select(el) {
    selected = el;
    $('[data-editor-selected]').removeAttr('data-editor-selected');
    $(el).attr('data-editor-selected', 'true');
    $('#editor-selected-name').text(el.getAttribute('data-editor-id'));
    var p = position(el), css = window.getComputedStyle(el);
    $('#editor-x').val(Math.round(p.x)); $('#editor-y').val(Math.round(p.y));
    $('#editor-width').val(parseInt(css.width, 10) || ''); $('#editor-height').val(parseInt(css.height, 10) || '');
    $('#editor-font').val(parseInt(css.fontSize, 10) || ''); $('#editor-color').val(colorHex(css.color));
  }
  function updateSelected() {
    if (!selected) return;
    var x = parseInt($('#editor-x').val(), 10) || 0, y = parseInt($('#editor-y').val(), 10) || 0;
    transform(selected, x, y);
    selected.style.width = $('#editor-width').val() ? $('#editor-width').val() + 'px' : '';
    selected.style.height = $('#editor-height').val() ? $('#editor-height').val() + 'px' : '';
    selected.style.fontSize = $('#editor-font').val() ? $('#editor-font').val() + 'px' : '';
    selected.style.color = $('#editor-color').val();
  }
  function save() {
    $('[data-editor-id]').each(function () {
      var p = position(this), item = { x: p.x, y: p.y, width: this.style.width, height: this.style.height, fontSize: this.style.fontSize, color: this.style.color };
      if ($(this).is('[data-editor-text]')) item.html = this.innerHTML;
      saved[this.getAttribute('data-editor-id')] = item;
    });
    localStorage.setItem(storageKey, JSON.stringify(saved));
    $('#editor-status').text('已儲存到這個瀏覽器');
  }
  function mount() {
    $('body').addClass('editor-active').append('<aside id="site-editor"><h3>編輯模式</h3><p>選取文字或區塊後調整</p><strong id="editor-selected-name">尚未選取</strong><label>X 位置<input id="editor-x" type="number"></label><label>Y 位置<input id="editor-y" type="number"></label><label>寬度<input id="editor-width" type="number"></label><label>高度<input id="editor-height" type="number"></label><label>字體大小<input id="editor-font" type="number"></label><label>文字顏色<input id="editor-color" type="color" value="#333333"></label><button id="editor-save">儲存</button><button id="editor-reset">重設</button><button id="editor-close">關閉編輯</button><small id="editor-status">修改後請按儲存</small></aside>');
    $('[data-editor-text]').attr({ contenteditable: 'true', spellcheck: 'false' }).on('click', function () { select(this); });
    $('[data-editor-draggable]').on('click', function () { select(this); }).on('mousedown', function (event) {
      if ($(event.target).closest('#site-editor').length) return;
      select(this); dragging = { el: this, x: event.clientX, y: event.clientY, p: position(this) }; event.preventDefault();
    });
    $(document).on('mousemove.editor', function (event) { if (dragging) transform(dragging.el, dragging.p.x + event.clientX - dragging.x, dragging.p.y + event.clientY - dragging.y); });
    $(document).on('mouseup.editor', function () { dragging = null; });
    $('#site-editor input').on('input', updateSelected);
    $('#editor-save').on('click', save);
    $('#editor-reset').on('click', function () { if (window.confirm('清除所有編輯結果？')) { localStorage.removeItem(storageKey); window.location.reload(); } });
    $('#editor-close').on('click', function () { window.location.href = window.location.pathname; });
  }

  mark(textTargets, 'data-editor-text');
  mark(dragTargets, 'data-editor-draggable');
  $('[data-editor-id]').each(function () { apply(this); });
  if (editMode) mount();
}(jQuery));
