/* Chord engine – no dependencies.
   Browser: window.ChordEngine      Node: require('./transpose.js')            */
(function (root) {
  'use strict';

  var SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  var NOTE = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, 'E#': 5, F: 5,
    'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11, 'B#': 0
  };
  // Keys that are normally written with flats (pitch-class numbers, C = 0)
  var FLAT_MAJOR = [5, 10, 3, 8, 1];      // F Bb Eb Ab Db
  var FLAT_MINOR = [2, 7, 0, 5, 10, 3];   // Dm Gm Cm Fm Bbm Ebm

  var QUAL = {
    '': [0, 4, 7], 'm': [0, 3, 7], 'min': [0, 3, 7], '-': [0, 3, 7], '5': [0, 7],
    '7': [0, 4, 7, 10], 'maj7': [0, 4, 7, 11], 'M7': [0, 4, 7, 11],
    'm7': [0, 3, 7, 10], 'min7': [0, 3, 7, 10], 'mmaj7': [0, 3, 7, 11],
    '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9],
    '9': [0, 4, 7, 10, 14], 'maj9': [0, 4, 7, 11, 14], 'm9': [0, 3, 7, 10, 14],
    'add9': [0, 4, 7, 14], 'madd9': [0, 3, 7, 14], '2': [0, 2, 4, 7], 'add2': [0, 2, 4, 7],
    'sus': [0, 5, 7], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7], '7sus4': [0, 5, 7, 10], '7sus': [0, 5, 7, 10],
    'dim': [0, 3, 6], 'dim7': [0, 3, 6, 9], 'm7b5': [0, 3, 6, 10],
    'aug': [0, 4, 8], '+': [0, 4, 8]
  };

  function mod(n, m) { return ((n % m) + m) % m; }
  /** Bring any semitone offset into -5..+6 so the display stays small. */
  function norm(t) { t = mod(t, 12); return t > 6 ? t - 12 : t; }
  function prefersFlats(rootPc, minor) { return (minor ? FLAT_MINOR : FLAT_MAJOR).indexOf(mod(rootPc, 12)) !== -1; }
  function noteName(pc, flats) { return (flats ? FLAT : SHARP)[mod(pc, 12)]; }
  function keyLabel(rootPc, minor, flats) { return noteName(rootPc, flats) + (minor ? 'm' : ''); }

  /** "C", "g", "Bb", "F#m", "A minor"… -> {root, minor} or null */
  function parseKey(input) {
    if (input === null || input === undefined) return null;
    var s = String(input).trim().replace(/♯/g, '#').replace(/♭/g, 'b');
    var m = /^([A-Ga-g])([#b]?)\s*(.*)$/.exec(s);
    if (!m) return null;
    var name = m[1].toUpperCase() + m[2];
    if (!Object.prototype.hasOwnProperty.call(NOTE, name)) return null;
    var rest = m[3].trim();
    var minor;
    if (rest === '' || rest === 'M' || /^(maj|major)$/i.test(rest)) minor = false;
    else if (/^(m|min|minor|-)$/i.test(rest)) minor = true;
    else return null;
    return { root: NOTE[name], minor: minor, acc: m[2] };
  }

  var CHORD_RE = /^([A-G][#b]?)([^\/\s]*)(?:\/([A-G][#b]?))?$/;

  /** "Am7/G" -> {root, rootName, quality, bass}  | null when it is not a chord (e.g. "N.C.") */
  function parseChord(str) {
    var m = CHORD_RE.exec(String(str).trim());
    if (!m) return null;
    if (!Object.prototype.hasOwnProperty.call(NOTE, m[1])) return null;
    if (m[3] && !Object.prototype.hasOwnProperty.call(NOTE, m[3])) return null;
    return { root: NOTE[m[1]], rootName: m[1], quality: m[2], bass: m[3] ? NOTE[m[3]] : null };
  }

  function transposeChord(str, semis, flats) {
    var c = parseChord(str);
    if (!c) return str;
    var out = noteName(c.root + semis, flats) + c.quality;
    if (c.bass !== null) out += '/' + noteName(c.bass + semis, flats);
    return out;
  }

  /** Transpose every [chord] inside a lyrics string. */
  function transposeText(text, semis, flats) {
    return String(text).replace(/\[([^\]]*)\]/g, function (_, c) {
      return '[' + transposeChord(c, semis, flats) + ']';
    });
  }

  /**
   * Everything the song page needs to know.
   *   songKey   original key of the typed chords ("G", "Em" …)
   *   t         transpose offset in semitones (singer's range)
   *   easyInput what the user typed in the "my easy key" box ('' = off)
   *
   * Without an easy key:  chords shown = original + t.
   * With an easy key:     chords shown = the song written in that key (the "shapes"),
   *                       capo = how far the keyboard/capo must go up to sound the real key.
   * A major key typed for a minor song (or the opposite) is mapped to its relative key,
   * so "C" for a song in Em gives Am shapes (same C-major scale).
   */
  function viewFor(songKey, t, easyInput) {
    var orig = parseKey(songKey);
    if (!orig) {
      return { hasKey: false, shift: t, flats: false, capo: 0, capoDown: 0, easy: null, easyInvalid: false };
    }
    var soundRoot = mod(orig.root + t, 12);
    // Keep the spelling the song's key was written with (G# stays G#, not Ab) while it is in its own key.
    var origFlats = orig.acc ? orig.acc === 'b' : prefersFlats(orig.root, orig.minor);
    var soundFlats = soundRoot === orig.root ? origFlats : prefersFlats(soundRoot, orig.minor);
    var res = {
      hasKey: true,
      minor: orig.minor,
      origName: keyLabel(orig.root, orig.minor, origFlats),
      soundingName: keyLabel(soundRoot, orig.minor, soundFlats),
      shift: t,
      flats: soundFlats,
      capo: 0,
      capoDown: 0,
      easy: null,
      easyInvalid: false
    };
    var typed = (easyInput || '').trim();
    if (!typed) return res;

    var e = parseKey(typed);
    if (!e) { res.easyInvalid = true; return res; }

    var shapeRoot;
    if (e.minor === orig.minor) shapeRoot = e.root;
    else if (orig.minor) shapeRoot = mod(e.root + 9, 12);   // major typed, minor song -> relative minor
    else shapeRoot = mod(e.root + 3, 12);                   // minor typed, major song -> relative major

    var shapeFlats = prefersFlats(shapeRoot, orig.minor);
    res.shift = mod(shapeRoot - orig.root, 12);
    res.flats = shapeFlats;
    res.capo = mod(soundRoot - shapeRoot, 12);
    res.capoDown = res.capo === 0 ? 0 : res.capo - 12;
    res.easy = {
      name: keyLabel(shapeRoot, orig.minor, shapeFlats),
      typed: typed,
      relative: e.minor !== orig.minor
    };
    return res;
  }

  /**
   * A saved "choir pick":  { sound: "A", shape: "E" }  or  { capo: 5, shape: "E" }
   *   sound = the scale the choir sings in, shape = the chords played, capo = derived
   *   (A sound + E shapes = capo 5;  G# sound + G shapes = capo 1).
   * Returns what the song page must apply, or null when the pick is unusable.
   */
  function resolveSetup(songKey, setup) {
    var orig = parseKey(songKey);
    if (!orig || !setup) return null;
    var shape = parseKey(setup.shape);
    if (!shape) return null;
    function inSongMode(k) { return k.minor === orig.minor ? k.root : orig.minor ? mod(k.root + 9, 12) : mod(k.root + 3, 12); }
    var shapeRoot = inSongMode(shape), soundRoot;
    var sound = setup.sound !== undefined && setup.sound !== null ? parseKey(setup.sound) : null;
    if (sound) soundRoot = inSongMode(sound);
    else if (typeof setup.capo === 'number') soundRoot = mod(shapeRoot + setup.capo, 12);
    else return null;
    var t = norm(soundRoot - orig.root);
    var easy = String(setup.shape).trim();
    var v = viewFor(songKey, t, easy);
    return {
      t: t,
      easy: easy,
      capo: v.capo,
      soundLabel: sound ? String(setup.sound).trim() : v.soundingName,
      shapeLabel: easy,
      note: setup.note ? String(setup.note) : ''
    };
  }

  function intervalsFor(q) {
    if (Object.prototype.hasOwnProperty.call(QUAL, q)) return QUAL[q].slice();
    var minor = /^(m(?!aj)|min|-)/.test(q);
    var dim = /dim|°/.test(q);
    var aug = /aug|\+/.test(q);
    var iv = dim ? [0, 3, 6] : aug ? [0, 4, 8] : minor ? [0, 3, 7] : [0, 4, 7];
    if (/sus2/.test(q)) iv[1] = 2; else if (/sus/.test(q)) iv[1] = 5;
    if (/maj7|M7|Δ/.test(q)) iv.push(11);
    else if (dim && /7/.test(q)) iv.push(9);
    else if (/7|9|11|13/.test(q)) iv.push(10);
    return iv;
  }

  /**
   * Which piano keys to press for a chord. Three octaves are drawn (positions 0..35):
   * left hand = bass note in the lowest octave, right hand = chord in the middle octave.
   */
  function chordKeys(str) {
    var c = parseChord(str);
    if (!c) return null;
    var iv = intervalsFor(c.quality);
    var minorQ = /^(m(?!aj)|min|dim|-)/.test(c.quality);
    var pcs = iv.map(function (i) { return mod(c.root + i, 12); });
    var flats;
    if (c.rootName.length > 1) flats = c.rootName.charAt(1) === 'b';
    else if (c.root === 5) flats = true;
    else {
      var hasFlatInd = pcs.indexOf(3) > -1 || pcs.indexOf(10) > -1;
      var hasSharpInd = pcs.indexOf(1) > -1 || pcs.indexOf(6) > -1 || pcs.indexOf(8) > -1;
      flats = hasFlatInd && !hasSharpInd;
    }
    if (c.rootName.length === 1 && c.root !== 5 && minorQ && prefersFlats(c.root, true) && !flats) {
      flats = pcs.indexOf(1) === -1 && pcs.indexOf(6) === -1;
    }
    var rh = iv.map(function (i) {
      var p = 12 + c.root + i;
      while (p >= 36) p -= 12;
      return p;
    });
    var lhPc = c.bass !== null ? c.bass : c.root;
    var names = [];
    var all = (c.bass !== null ? [c.bass] : []).concat(pcs);
    all.forEach(function (pc) {
      var n = noteName(pc, flats);
      if (names.indexOf(n) === -1) names.push(n);
    });
    return { rh: rh, lh: lhPc, rootPos: 12 + c.root, names: names, flats: flats, slash: c.bass !== null };
  }

  /**
   * One lyrics line -> structure the renderer can draw.
   *   {type:'blank'} | {type:'section', text} | {type:'plain', text}
   *   {type:'chords', tokens:[ {t:'w', parts:[{chord, text}]} | {t:'s', text} ]}
   * A "word" (t:'w') never breaks across lines, even when a chord sits mid-word.
   */
  function parseLine(line) {
    if (/^\s*$/.test(line)) return { type: 'blank' };
    var sm = /^\s*##\s*(.*)$/.exec(line);
    if (sm) return { type: 'section', text: sm[1].trim() };
    if (!/\[[^\]]*\]/.test(line)) return { type: 'plain', text: line };

    var parts = line.split(/\[([^\]]*)\]/);
    var frags = [];
    if (parts[0] !== '') frags.push({ chord: null, text: parts[0] });
    for (var i = 1; i < parts.length; i += 2) {
      frags.push({ chord: parts[i].trim() || null, text: parts[i + 1] || '' });
    }

    var tokens = [];
    var cur = null;
    function addPiece(chord, text) { if (!cur) cur = []; cur.push({ chord: chord, text: text }); }
    function closeWord() { if (cur) { tokens.push({ t: 'w', parts: cur }); cur = null; } }

    frags.forEach(function (f) {
      var pending = f.chord;
      f.text.split(/(\s+)/).forEach(function (piece) {
        if (piece === '') return;
        if (/^\s+$/.test(piece)) {
          if (pending) { addPiece(pending, ''); pending = null; }
          closeWord();
          tokens.push({ t: 's', text: piece });
        } else {
          addPiece(pending, piece);
          pending = null;
        }
      });
      if (pending) { addPiece(pending, ''); pending = null; }
    });
    closeWord();
    return { type: 'chords', tokens: tokens };
  }

  var api = {
    mod: mod, norm: norm, noteName: noteName, prefersFlats: prefersFlats,
    parseKey: parseKey, parseChord: parseChord,
    transposeChord: transposeChord, transposeText: transposeText,
    viewFor: viewFor, resolveSetup: resolveSetup, chordKeys: chordKeys, parseLine: parseLine
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChordEngine = api;
})(typeof window !== 'undefined' ? window : this);
