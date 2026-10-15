/* ==========================================================
   CHOIR SONGBOOK – DATA FILE (admin edits only this file)
   ==========================================================
   1) CONFIG   – choir name + where song requests are sent
   2) SONGS    – the song library
   3) SERVICES – the lists for each date

   LYRICS FORMAT (ChordPro style):
   - Put the chord in [brackets] right before the syllable it falls on:
         [G]Amazing grace, how [C]sweet the [G]sound
   - A line starting with "## " is a section label:  ## Chorus
   - Blank line = space between blocks.
   - Works for Nepali / Hindi (Devanagari) too.

   SONG FIELDS:
     id      unique short name, no spaces (used in service lists)
     title   song title
     group   category: "Bhajan", "Hymn", "Chorus", "English", "Hindi", "Nepali" ...
     number  (optional) bhajan / hymn number
     key     ORIGINAL key of the chords you typed, e.g. "G", "Bb", "Am"
     lyrics  the text with chords
     setups  (optional) CHOIR PICKS – combinations the choir found clean and nice.
             Each pick is:  { sound: "A", shape: "E", note: "warm, easy for altos" }
               sound = the scale the choir sings in
               shape = the chords the player uses
               The capo is worked out for you (A sound with E shapes = capo 5,
               G# sound with G shapes = capo 1). You may write  capo: 5  instead of
               sound if you prefer:  { shape: "E", capo: 5 }
             Tip: on a song page, set what you like and press "Save current setup"
             to get a ready-made line to paste here.

   SERVICE FIELDS (lists of song ids, in order):
     starter  – opening bhajans/hymns (everyone sings)
     worship  – aaradhana (choir sings)
     bheti    – offering songs
     bhoj     – Prabhu Bhoj (first Saturday of the month; leave out otherwise)
   ========================================================== */

window.CHOIR_CONFIG = {
  choirName: "Choir Songbook",
  // Song requests: fill ONE of these (international format, no + or spaces).
  // If both are empty, the request text is copied so the user can paste it anywhere.
  requestWhatsApp: "",      // e.g. "9779800000000"
  requestEmail: ""          // e.g. "admin@example.com"
};

window.SONGS = [
  {
    id: "bhajan-12",
    title: "येशू मेरो मुक्तिदाता (नमुना / sample)",
    group: "Bhajan",
    number: 12,
    key: "G",
    lyrics: `## Verse
[G]येशू मेरो [C]मुक्तिदाता
[G]तिमी नै मेरो [D]आशा
[G]तिम्रै नाम [C]लिएर गाउँछु
[G]सधैँ [D]धन्यवा[G]द`
  },
  {
    id: "what-a-friend",
    title: "What a Friend We Have in Jesus",
    group: "Hymn",
    number: 5,
    key: "C",
    lyrics: `## Verse 1
What a [C]friend we have in [F]Jesus
All our [C]sins and griefs to [G]bear
What a [C]privilege to [F]carry
Everything to [C]God in [G]prayer[C]`
  },
  {
    id: "holy-holy-holy",
    title: "Holy, Holy, Holy",
    group: "Hymn",
    number: 1,
    key: "D",
    lyrics: `## Verse 1
[D]Holy, holy, [G]holy! [D]Lord God [A]Almighty!
[D]Early in the [G]morning our [D]song shall [A]rise to [D]Thee
[D]Holy, holy, [G]holy! [D]Merciful and [A]mighty
[D]God in three [G]Persons, [D]blessed [A]Trini[D]ty`
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    group: "English",
    key: "G",
    setups: [
      { sound: "G#", shape: "G", note: "Capo 1 with G chords: clean and warm" },
      { sound: "A",  shape: "E", note: "Capo 5 with E chords" }
    ],
    lyrics: `## Verse 1
[G]Amazing grace, how [G7]sweet the [C]sound
That [G]saved a wretch like [D]me
I [G]once was lost, but [G7]now am [C]found
Was [G]blind, but [D]now I [G]see`
  },
  {
    id: "blessed-assurance",
    title: "Blessed Assurance",
    group: "English",
    key: "D",
    lyrics: `## Verse 1
[D]Blessed assurance, [A]Jesus is [D]mine
O what a [G]foretaste of [A]glory di[D]vine
[D]Heir of salvation, [A]purchase of [D]God
[G]Born of His Spirit, [A]washed in His [D]blood

## Chorus
This is my [G]story, this is my [D]song
Praising my [A]Savior all the day [D]long`
  },
  {
    id: "worship-sample",
    title: "तिमी नै मेरो राजा (नमुना / sample)",
    group: "Nepali",
    key: "Em",
    lyrics: `## Chorus
[Em]तिमी नै मेरो [C]राजा
[G]तिमी नै मेरो [D]प्रभु
[Em]म आराधना [C]गर्छु
[G]सधैँ [D]तिम्रै [Em]सामु`
  }
];

window.SERVICES = [
  {
    date: "2026-10-17",
    starter: ["bhajan-12", "what-a-friend"],
    worship: ["blessed-assurance", "worship-sample", "amazing-grace"],
    bheti:   ["holy-holy-holy"]
  },
  {
    date: "2026-11-07",            // first Saturday -> Prabhu Bhoj
    starter: ["holy-holy-holy", "bhajan-12"],
    worship: ["amazing-grace", "worship-sample"],
    bheti:   ["what-a-friend"],
    bhoj:    ["blessed-assurance"]
  }
];
