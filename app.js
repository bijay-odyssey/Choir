/* Choir Songbook – viewer app (static, no backend). Data lives in data.js. */
(function () {
  'use strict';

  var E = window.ChordEngine;
  var CFG = window.CHOIR_CONFIG || {};
  var SONGS = window.SONGS || [];
  var SERVICES = (window.SERVICES || []).slice().sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });

  var SECTIONS = [
    { key: 'starter', title: 'Starter', np: 'सुरुवाती भजन', hint: 'Bhajans & hymns · everyone sings' },
    { key: 'worship', title: 'Worship', np: 'आराधना', hint: 'Aaradhana · choir leads' },
    { key: 'bheti', title: 'Bheti', np: 'भेटी', hint: 'Offering' },
    { key: 'bhoj', title: 'Prabhu Bhoj', np: 'प्रभु भोज', hint: 'First Saturday of the month' }
  ];

  var byId = {};
  SONGS.forEach(function (s) {
    if (byId[s.id]) console.warn('Duplicate song id:', s.id);
    byId[s.id] = s;
    s._search = (s.title + ' ' + (s.number || '') + ' ' + (s.group || '') + ' ' +
      (s.lyrics || '').replace(/\[[^\]]*\]/g, '')).toLowerCase();
  });

  /* ---------- small helpers ---------- */
  var app = document.getElementById('app');
  var modalRoot = document.getElementById('modal');
  var currentDate = '';

  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem('cs:' + k);
      localStorage.setItem('cs:' + k, v);
    } catch (e) { /* private mode etc. */ }
    return null;
  }
  /* Update the address bar without re-rendering. Browsers refuse this on file:// pages, so never let it throw. */
  function setUrl(hash) {
    try { history.replaceState(null, '', hash); } catch (e) { /* opened from a file: fine, just no shareable URL */ }
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fmtLong(s) {
    var d = parseDate(s);
    return d ? d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : s;
  }
  function fmtShort(s) {
    var d = parseDate(s);
    return d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : s;
  }
  function defaultDate() {
    var t = todayStr();
    var up = SERVICES.filter(function (x) { return x.date >= t; })[0];
    if (up) return up.date;
    return SERVICES.length ? SERVICES[SERVICES.length - 1].date : t;
  }
  function songTag(s) { return s.number ? (s.group || 'Song') + ' ' + s.number : (s.group || 'Song'); }
  function signed(n) { return n === 0 ? '0' : (n > 0 ? '+' : '−') + Math.abs(n); }

  var state = {
    easy: store('easy') || '',
    fs: parseInt(store('fs'), 10) || 20,
    chords: store('chords') !== '0'
  };

  /* ---------- modal ---------- */
  function openModal(html, onMount) {
    var prev = document.activeElement;
    modalRoot.innerHTML = '<div class="backdrop" data-close></div>' +
      '<div class="msheet" role="dialog" aria-modal="true">' +
      '<button type="button" class="x" data-close aria-label="Close">×</button>' + html + '</div>';
    modalRoot.hidden = false;
    function close() {
      modalRoot.hidden = true;
      modalRoot.innerHTML = '';
      document.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    Array.prototype.forEach.call(modalRoot.querySelectorAll('[data-close]'), function (b) {
      b.addEventListener('click', close);
    });
    if (onMount) onMount(modalRoot, close);
    var f = modalRoot.querySelector('input,select,textarea');
    if (f) f.focus();
    return close;
  }

  /* ---------- piano popup ---------- */
  var WHITE_POS = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
  var BLACK_PREV = { 1: 0, 3: 2, 6: 5, 8: 7, 10: 9 };

  function pianoSvg(k) {
    var W = 22, H = 100, BW = 13, BH = 62, OCT = 3;
    var on = {}, white = '', black = '';
    k.rh.forEach(function (p) { on[p] = true; });
    for (var p = 0; p < OCT * 12; p++) {
      var oct = Math.floor(p / 12), pc = p % 12;
      var cls = p === k.lh ? ' bass' : (on[p] ? (p === k.rootPos ? ' on root' : ' on') : '');
      if (WHITE_POS[pc] !== undefined) {
        var x = (oct * 7 + WHITE_POS[pc]) * W;
        white += '<rect x="' + x + '" y="0" width="' + W + '" height="' + H + '" rx="2" class="wk' + cls + '"/>';
        if (pc === 0) white += '<text x="' + (x + W / 2) + '" y="' + (H - 6) + '" text-anchor="middle" class="kl">C</text>';
      } else {
        var bx = (oct * 7 + WHITE_POS[BLACK_PREV[pc]] + 1) * W - BW / 2;
        black += '<rect x="' + bx + '" y="0" width="' + BW + '" height="' + BH + '" rx="2" class="bk' + cls + '"/>';
      }
    }
    return '<svg viewBox="0 0 ' + (OCT * 7 * W) + ' ' + H + '" class="piano" role="img" aria-label="Piano keys: ' +
      esc(k.names.join(' ')) + '">' + white + black + '</svg>';
  }

  function openPiano(chord) {
    var k = E.chordKeys(chord);
    if (!k) return;
    openModal('<h2>' + esc(chord) + '</h2>' +
      '<p class="muted">Notes: <b>' + esc(k.names.join(' · ')) + '</b></p>' +
      pianoSvg(k) +
      '<p class="legend"><span class="dot bass"></span> left hand' + (k.slash ? ' (bass note)' : ' (root)') +
      ' &nbsp; <span class="dot on"></span> right hand</p>');
  }

  /* ---------- request a song ---------- */
  function openRequest(pre) {
    pre = pre || {};
    var opts = [['', 'Not sure'], ['starter', 'Starter'], ['worship', 'Worship'], ['bheti', 'Bheti'], ['bhoj', 'Prabhu Bhoj']];
    var wa = String(CFG.requestWhatsApp || '').replace(/\D/g, '');
    var mail = CFG.requestEmail || '';
    var html = '<h2>Request a song</h2>' +
      '<p class="muted">Only the admin can change the lists. Send a request and they will add it if they can.</p>' +
      '<form id="reqForm" autocomplete="off">' +
      '<label>Song name or number<input name="song" required value="' + esc(pre.song) + '"></label>' +
      '<label>Which list<select name="list">' + opts.map(function (o) {
        return '<option value="' + o[0] + '"' + (pre.list === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></label>' +
      '<label>Date<input type="date" name="date" value="' + esc(pre.date || currentDate) + '"></label>' +
      '<label>Your name<input name="name"></label>' +
      '<label>Note (optional)<textarea name="note" rows="2"></textarea></label>' +
      '<div class="row-actions">' +
      (wa ? '<button type="button" class="btn primary" data-send="wa">Send on WhatsApp</button>' : '') +
      (mail ? '<button type="button" class="btn' + (wa ? '' : ' primary') + '" data-send="mail">Send by email</button>' : '') +
      '<button type="button" class="btn' + (wa || mail ? '' : ' primary') + '" data-send="copy">Copy request</button>' +
      '</div><p id="reqMsg" class="muted" aria-live="polite"></p></form>';

    openModal(html, function (root) {
      var form = root.querySelector('#reqForm');
      var msg = root.querySelector('#reqMsg');
      function compose() {
        var f = form.elements, L = ['Song request - ' + (CFG.choirName || 'Choir Songbook')];
        L.push('Song: ' + f.song.value.trim());
        if (f.list.value) L.push('List: ' + f.list.options[f.list.selectedIndex].text);
        if (f.date.value) L.push('Date: ' + fmtLong(f.date.value));
        if (f.name.value.trim()) L.push('From: ' + f.name.value.trim());
        if (f.note.value.trim()) L.push('Note: ' + f.note.value.trim());
        return L.join('\n');
      }
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      form.addEventListener('click', function (e) {
        var b = e.target.closest('[data-send]');
        if (!b) return;
        if (!form.reportValidity()) return;
        var text = compose(), how = b.getAttribute('data-send');
        if (how === 'wa') {
          window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        } else if (how === 'mail') {
          location.href = 'mailto:' + mail + '?subject=' + encodeURIComponent('Song request') + '&body=' + encodeURIComponent(text);
        } else {
          var done = function () { msg.textContent = 'Copied. Paste it to the admin.'; };
          var fail = function () { msg.textContent = 'Could not copy automatically. Select this text and send it to the admin:\n' + text; };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
          else fail();
        }
      });
    });
  }

  /* ---------- pages ---------- */
  function setTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (a) {
      a.classList.toggle('active', a.getAttribute('data-tab') === name);
    });
  }
  function notFound(text) {
    setTab('');
    app.innerHTML = '<section class="page"><h1>Not found</h1><p class="muted">' + esc(text) +
      '</p><p><a class="btn" href="#/">Back to services</a></p></section>';
  }

  function rowHtml(s, href, n) {
    return '<li><a class="row" href="' + href + '">' +
      '<span class="num">' + (n !== undefined ? n : (s.number ? esc(s.number) : '♪')) + '</span>' +
      '<span class="rt"><b>' + esc(s.title) + '</b><small>' + esc(songTag(s)) + '</small></span>' +
      '<span class="key">' + esc(s.key || '') + '</span></a></li>';
  }

  function servicesPage(date) {
    setTab('services');
    var d = parseDate(date) ? date : defaultDate();
    currentDate = d;
    var svc = SERVICES.filter(function (x) { return x.date === d; })[0];
    var t = todayStr();

    var dates = SERVICES.filter(function (x) { return x.date >= t; }).slice(0, 6).map(function (x) { return x.date; });
    SERVICES.filter(function (x) { return x.date < t; }).slice(-2).forEach(function (x) { dates.push(x.date); });
    if (svc && dates.indexOf(d) === -1) dates.push(d);
    dates.sort();

    var html = '<section class="page"><div class="datebar">' +
      '<label class="dl">Date <input type="date" id="dateIn" value="' + esc(d) + '"></label>' +
      '<div class="chips">' + dates.map(function (x) {
        return '<a class="chip' + (x === d ? ' on' : '') + '" href="#/service/' + x + '">' + esc(fmtShort(x)) + '</a>';
      }).join('') + '</div></div>' +
      '<h1>' + esc(fmtLong(d)) + '</h1>';

    if (!svc) {
      html += '<div class="card empty"><p>No list has been added for this date yet.</p>' +
        '<button type="button" class="btn" id="reqHere">Request songs for this date</button></div>';
    } else {
      SECTIONS.forEach(function (sec) {
        var ids = svc[sec.key];
        if (!ids || !ids.length) return;
        html += '<section class="card"><header class="sh"><h2>' + sec.title + ' <span class="np">' + sec.np + '</span></h2>' +
          '<small>' + sec.hint + '</small></header><ol class="list">';
        ids.forEach(function (id, i) {
          var s = byId[id];
          if (!s) { html += '<li class="missing">Missing song id: ' + esc(id) + '</li>'; return; }
          html += rowHtml(s, '#/song/' + encodeURIComponent(id) + '?d=' + d + '&l=' + sec.key, i + 1);
        });
        html += '</ol></section>';
      });
    }
    html += '</section>';
    app.innerHTML = html;

    app.querySelector('#dateIn').addEventListener('change', function (e) {
      if (e.target.value) location.hash = '#/service/' + e.target.value;
    });
    var rb = app.querySelector('#reqHere');
    if (rb) rb.addEventListener('click', function () { openRequest({ date: d }); });
  }

  function libraryPage(params) {
    setTab('songs');
    var q = params.get('q') || '', g = params.get('g') || '';
    var groups = [];
    SONGS.forEach(function (s) { if (s.group && groups.indexOf(s.group) < 0) groups.push(s.group); });

    app.innerHTML = '<section class="page"><h1>Songs</h1>' +
      '<input type="search" id="q" class="search" placeholder="Search title, number or words…" value="' + esc(q) + '" aria-label="Search songs">' +
      '<div class="chips" id="gchips"></div><p class="muted" id="count"></p><div id="results"></div></section>';

    var chipsEl = app.querySelector('#gchips'), resEl = app.querySelector('#results'), countEl = app.querySelector('#count');

    function chips() {
      chipsEl.innerHTML = ['All'].concat(groups).map(function (x) {
        var on = (x === 'All' && !g) || x === g;
        return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-g="' + esc(x === 'All' ? '' : x) + '">' + esc(x) + '</button>';
      }).join('');
    }
    function numOf(s) { var n = parseInt(s.number, 10); return isNaN(n) ? 1e9 : n; }
    function render() {
      var qq = q.trim().toLowerCase();
      var rows = SONGS.filter(function (s) { return (!g || s.group === g) && (!qq || s._search.indexOf(qq) > -1); });
      rows.sort(function (a, b) {
        var ga = groups.indexOf(a.group), gb = groups.indexOf(b.group);
        if (ga !== gb) return ga - gb;
        if (numOf(a) !== numOf(b)) return numOf(a) - numOf(b);
        return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
      });
      countEl.textContent = rows.length + (rows.length === 1 ? ' song' : ' songs');
      if (!rows.length) { resEl.innerHTML = '<p class="muted">Nothing found. Try another word, or request the song.</p>'; return; }
      var html = '', last = null;
      rows.forEach(function (s) {
        if (s.group !== last) {
          if (last !== null) html += '</ol>';
          html += '<h2 class="gh">' + esc(s.group || 'Other') + '</h2><ol class="list card">';
          last = s.group;
        }
        html += rowHtml(s, '#/song/' + encodeURIComponent(s.id));
      });
      resEl.innerHTML = html + '</ol>';
    }
    function sync() {
      var p = [];
      if (q) p.push('q=' + encodeURIComponent(q));
      if (g) p.push('g=' + encodeURIComponent(g));
      setUrl('#/songs' + (p.length ? '?' + p.join('&') : ''));
    }
    app.querySelector('#q').addEventListener('input', function (e) { q = e.target.value; sync(); render(); });
    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-g]');
      if (!b) return;
      g = b.getAttribute('data-g');
      sync(); chips(); render();
    });
    chips(); render();
  }

  function renderLyrics(lyrics, view) {
    var out = [];
    String(lyrics || '').split(/\r?\n/).forEach(function (line) {
      var p = E.parseLine(line);
      if (p.type === 'blank') out.push('<div class="gap"></div>');
      else if (p.type === 'section') out.push('<div class="sec">' + esc(p.text) + '</div>');
      else if (p.type === 'plain') out.push('<div class="ln plain">' + esc(p.text) + '</div>');
      else {
        var h = '<div class="ln">';
        p.tokens.forEach(function (tk) {
          if (tk.t === 's') { h += ' '; return; }
          h += '<span class="w">';
          tk.parts.forEach(function (part) {
            var chord = part.chord ? E.transposeChord(part.chord, view.shift, view.flats) : '';
            h += '<span class="seg"><span class="ch"' +
              (chord ? ' role="button" tabindex="0" data-chord="' + esc(chord) + '"' : '') + '>' + esc(chord) +
              '</span><span class="tx">' + (part.text ? esc(part.text) : ' ') + '</span></span>';
          });
          h += '</span>';
        });
        out.push(h + '</div>');
      }
    });
    return out.join('');
  }

  function songPage(id, params) {
    var s = byId[id];
    if (!s) return notFound('Song not found: ' + id);
    setTab('');

    var ctx = null, d = params.get('d'), l = params.get('l');
    if (d && l) {
      var svc = SERVICES.filter(function (x) { return x.date === d; })[0];
      var list = svc && svc[l];
      var idx = list ? list.indexOf(id) : -1;
      if (idx > -1) ctx = { d: d, l: l, list: list, i: idx };
    }
    var secInfo = ctx ? SECTIONS.filter(function (x) { return x.key === ctx.l; })[0] : null;

    var t = params.has('t') ? parseInt(params.get('t'), 10) : parseInt(store('t:' + id), 10);
    t = isNaN(t) ? 0 : E.norm(t);

    // Choir picks saved by the admin in data.js (sound scale + chord shapes + capo)
    var setups = (s.setups || []).map(function (x) { return E.resolveSetup(s.key, x); }).filter(Boolean);
    var easy = state.easy, active = -1;
    var pp = params.has('p') ? parseInt(params.get('p'), 10) : parseInt(store('p:' + id), 10);
    if (!isNaN(pp) && setups[pp]) { active = pp; t = setups[pp].t; easy = setups[pp].easy; }

    var crumb = ctx
      ? '<a href="#/service/' + ctx.d + '">‹ ' + esc(secInfo ? secInfo.title : 'List') + ' · ' + esc(fmtShort(ctx.d)) + '</a>'
      : '<a href="#/songs">‹ All songs</a>';

    var pager = '';
    if (ctx) {
      var prev = ctx.list[ctx.i - 1], next = ctx.list[ctx.i + 1];
      var link = function (sid, label, cls) {
        return sid && byId[sid]
          ? '<a class="btn ' + cls + '" href="#/song/' + encodeURIComponent(sid) + '?d=' + ctx.d + '&l=' + ctx.l + '">' + label + '</a>'
          : '<span class="btn ' + cls + ' off">' + label + '</span>';
      };
      pager = '<nav class="pager" aria-label="Songs in this list"><div class="pin">' +
        link(prev, '‹ Prev', 'pv') + '<span class="pos">' + (ctx.i + 1) + ' / ' + ctx.list.length + '</span>' +
        link(next, 'Next ›', 'nx') + '</div></nav>';
    }

    app.innerHTML = '<section class="page song' + (ctx ? ' haspager' : '') + '">' +
      '<div class="crumb">' + crumb + '</div>' +
      '<h1>' + esc(s.title) + '</h1><p class="meta" id="meta"></p>' +
      '<div class="picks" id="picks"></div>' +
      '<div class="toolbar" role="group" aria-label="Song tools">' +
      '<div class="tp"><button type="button" class="btn sq" id="tDown" aria-label="Lower by one semitone">−</button>' +
      '<div class="tval" aria-live="polite"><b id="keyNow">–</b><small id="tOff"></small></div>' +
      '<button type="button" class="btn sq" id="tUp" aria-label="Raise by one semitone">+</button>' +
      '<button type="button" class="btn" id="tReset">Reset</button></div>' +
      '<div class="easy"><label for="easy">My easy key</label>' +
      '<input id="easy" type="text" inputmode="text" maxlength="8" placeholder="e.g. C" autocomplete="off" autocapitalize="characters" value="' + esc(easy) + '">' +
      '<button type="button" class="btn sq" id="easyClear" aria-label="Clear easy key">×</button></div>' +
      '<div class="view"><button type="button" class="btn sq" id="fMinus" aria-label="Smaller text">A−</button>' +
      '<button type="button" class="btn sq" id="fPlus" aria-label="Bigger text">A+</button>' +
      '<button type="button" class="btn" id="chToggle" aria-pressed="true">Chords</button></div></div>' +
      '<div id="capoBox" class="capo" aria-live="polite" hidden></div>' +
      '<div id="sheet" class="sheet"></div>' +
      '<div class="foot"><button type="button" class="btn" id="reqSong">Request a song…</button></div>' +
      pager + '</section>';

    var sheet = app.querySelector('#sheet'), capoBox = app.querySelector('#capoBox'), picksEl = app.querySelector('#picks');
    var easyIn = app.querySelector('#easy');

    function update() {
      var v = E.viewFor(s.key, t, easy);
      var soundName = active > -1 ? setups[active].soundLabel : v.soundingName;
      var shapeName = v.easy ? (active > -1 ? setups[active].shapeLabel : v.easy.name) : '';
      app.querySelector('#meta').textContent = songTag(s) + (v.hasKey ? ' · Original key ' + v.origName : '');
      app.querySelector('#keyNow').textContent = v.hasKey ? soundName : '–';
      app.querySelector('#tOff').textContent = t === 0 ? 'original' : signed(t);
      app.querySelector('#tReset').disabled = t === 0;
      easyIn.disabled = !v.hasKey;
      easyIn.classList.toggle('bad', !!v.easyInvalid);

      var note = '';
      if (!v.hasKey) {
        note = 'This song has no key set in data.js, so only plain +/− transpose is available.';
      } else if (v.easyInvalid) {
        note = 'Type a key like <b>C</b>, <b>G</b>, <b>Bb</b> or <b>Am</b>.';
      } else if (v.easy) {
        if (v.capo === 0) {
          note = 'Chords are in <b>' + esc(shapeName) + '</b>, which already sounds in <b>' + esc(soundName) +
            '</b>. No capo / keyboard transpose needed.';
        } else {
          note = 'Play <b>' + esc(shapeName) + '</b> chords. Set capo / keyboard transpose to <b>' + signed(v.capo) +
            '</b>' + (Math.abs(v.capoDown) <= 6 ? ' (or <b>' + signed(v.capoDown) + '</b>)' : '') +
            ' to sound in <b>' + esc(soundName) + '</b>.';
        }
        if (v.easy.relative) {
          note += ' <span class="muted">(' + esc(v.easy.typed) + ' mapped to its relative key for this ' + (v.minor ? 'minor' : 'major') + ' song.)</span>';
        }
      }
      capoBox.hidden = !note;
      capoBox.classList.toggle('warn', !!(v.easyInvalid || !v.hasKey));
      capoBox.innerHTML = note;

      picksEl.innerHTML = renderPicks();
      curSetup = { sound: soundName, shape: v.easy ? shapeName : (v.hasKey ? soundName : ''), capo: v.easy ? v.capo : 0, ok: v.hasKey };
      sheet.innerHTML = renderLyrics(s.lyrics, v);
      sheet.style.setProperty('--fs', state.fs + 'px');
      sheet.classList.toggle('nochords', !state.chords);
      var tg = app.querySelector('#chToggle');
      tg.setAttribute('aria-pressed', state.chords ? 'true' : 'false');
      tg.classList.toggle('on', state.chords);
    }
    function syncUrl() {
      var p = [];
      if (ctx) { p.push('d=' + ctx.d); p.push('l=' + ctx.l); }
      if (active > -1) p.push('p=' + active); else if (t) p.push('t=' + t);
      store('t:' + id, String(t));
      store('p:' + id, active > -1 ? String(active) : '');
      setUrl('#/song/' + encodeURIComponent(id) + (p.length ? '?' + p.join('&') : ''));
    }
    function setT(n) { active = -1; t = E.norm(n); syncUrl(); update(); }
    function applyPick(i) {
      if (!setups[i]) return;
      active = i; t = setups[i].t; easy = setups[i].easy;
      easyIn.value = easy;
      syncUrl(); update();
    }
    var curSetup = null;
    function renderPicks() {
      var h = '<div class="ph"><b>Choir picks</b> <span class="muted">scale we sing · chords we play</span></div>';
      if (setups.length) {
        h += '<div class="chips">' + setups.map(function (x, i) {
          return '<button type="button" class="chip pick' + (i === active ? ' on' : '') + '" data-p="' + i + '" aria-pressed="' + (i === active) + '">' +
            '<b>' + esc(x.soundLabel) + '</b> · play ' + esc(x.shapeLabel) + ' · ' + (x.capo ? 'capo ' + x.capo : 'no capo') + '</button>';
        }).join('') + '</div>';
        if (active > -1 && setups[active].note) h += '<p class="pnote">' + esc(setups[active].note) + '</p>';
      } else {
        h += '<p class="muted pnote">No picks saved for this song yet.</p>';
      }
      return h + '<button type="button" class="btn small" id="saveSetup">Save current setup…</button>';
    }
    function openSaveSetup() {
      if (!curSetup || !curSetup.ok) return;
      var line = '{ sound: "' + curSetup.sound + '", shape: "' + curSetup.shape + '", note: "" },';
      var text = '// ' + id + ' - ' + s.title + '\n' + line;
      openModal('<h2>Save this setup</h2>' +
        '<p>Sound <b>' + esc(curSetup.sound) + '</b> · play <b>' + esc(curSetup.shape) + '</b> · ' +
        (curSetup.capo ? 'capo <b>' + curSetup.capo + '</b>' : '<b>no capo</b>') + '</p>' +
        '<p class="muted">Send this line to the admin. They paste it into the <code>setups: [ ]</code> list of this song in data.js.</p>' +
        '<textarea readonly rows="3" id="snip">' + esc(text) + '</textarea>' +
        '<div class="row-actions"><button type="button" class="btn primary" id="copySnip">Copy</button></div>' +
        '<p id="snipMsg" class="muted" aria-live="polite"></p>', function (root) {
        var msg = root.querySelector('#snipMsg'), ta = root.querySelector('#snip');
        ta.focus(); ta.select();
        root.querySelector('#copySnip').addEventListener('click', function () {
          var ok = function () { msg.textContent = 'Copied. Send it to the admin.'; };
          var no = function () { ta.select(); msg.textContent = 'Select the text above and copy it.'; };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, no); else no();
        });
      });
    }
    picksEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]');
      if (b) return applyPick(parseInt(b.getAttribute('data-p'), 10));
      if (e.target.closest('#saveSetup')) openSaveSetup();
    });

    app.querySelector('#tDown').addEventListener('click', function () { setT(t - 1); });
    app.querySelector('#tUp').addEventListener('click', function () { setT(t + 1); });
    app.querySelector('#tReset').addEventListener('click', function () { setT(0); });
    easyIn.addEventListener('input', function () {
      state.easy = easyIn.value.trim();
      store('easy', state.easy);
      easy = state.easy; active = -1; syncUrl();
      update();
    });
    app.querySelector('#easyClear').addEventListener('click', function () {
      easyIn.value = ''; state.easy = ''; store('easy', ''); easy = ''; active = -1; syncUrl(); update(); easyIn.focus();
    });
    app.querySelector('#fMinus').addEventListener('click', function () {
      state.fs = Math.max(14, state.fs - 2); store('fs', String(state.fs)); update();
    });
    app.querySelector('#fPlus').addEventListener('click', function () {
      state.fs = Math.min(40, state.fs + 2); store('fs', String(state.fs)); update();
    });
    app.querySelector('#chToggle').addEventListener('click', function () {
      state.chords = !state.chords; store('chords', state.chords ? '1' : '0'); update();
    });
    app.querySelector('#reqSong').addEventListener('click', function () {
      openRequest({ song: songTag(s) + ' - ' + s.title, date: ctx ? ctx.d : '' });
    });
    sheet.addEventListener('click', function (e) {
      var c = e.target.closest('.ch');
      if (c && c.getAttribute('data-chord')) openPiano(c.getAttribute('data-chord'));
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var c = e.target.closest('.ch');
      if (c && c.getAttribute('data-chord')) { e.preventDefault(); openPiano(c.getAttribute('data-chord')); }
    });
    update();
    window.scrollTo(0, 0);
  }

  /* ---------- router ---------- */
  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var q = h.indexOf('?');
    var path = q < 0 ? h : h.slice(0, q);
    var params = new URLSearchParams(q < 0 ? '' : h.slice(q + 1));
    var parts = path.split('/').filter(Boolean).map(function (x) {
      try { return decodeURIComponent(x); } catch (e) { return x; }
    });
    if (!modalRoot.hidden) { modalRoot.hidden = true; modalRoot.innerHTML = ''; }
    if (parts.length === 0) return servicesPage('');
    if (parts[0] === 'service') return servicesPage(parts[1] || '');
    if (parts[0] === 'songs') return libraryPage(params);
    if (parts[0] === 'song' && parts[1]) return songPage(parts[1], params);
    notFound('That page does not exist.');
  }

  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (!modalRoot.hidden) return;
    var b = e.key === 'ArrowLeft' ? document.querySelector('.pager .pv:not(.off)')
      : e.key === 'ArrowRight' ? document.querySelector('.pager .nx:not(.off)') : null;
    if (b) b.click();
  });

  document.getElementById('reqBtn').addEventListener('click', function () { openRequest({}); });
  var name = CFG.choirName || 'Choir Songbook';
  document.title = name;
  document.getElementById('brand').textContent = name;
  window.addEventListener('hashchange', route);
  route();
})();
