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
  },
  {
    id: "malai-tapaiko-khancho",
    title: "मलाई तपाईंको खाँचो छ",
    group: "Nepali",
    key: "C",
    lyrics: `## Chorus
[C]मलाई तपा[G]ईंको [F]खाँचो [C]छ, हात [G]प्रेम[F]को बढ़ाउनुहोस्
[C]सिंहासनबाट [G]आउनुहोस्, [F]नदी [C]प्रेमको [G]बहा[F]उनुहोस्, [G]हे ये[C]शू

## Verse 1
[C]तपाईंको [F]उपस्थितिमा डोर्याउनु[C]होस्
मेरो [G]हृदय, आत्मा छुनु[C]होस्
[Am]नयाँ [Dm]आशा, भ[F]रोसा, [C]नयाँ [Dm]चङ्गाइ र [F]मुक्ति दिनु[C]होस्

## Verse 2
[C]तपाईंको [F]स्वतन्त्रभित्र लानु[C]होस्
मेरो [G]हृदय, आत्मा फुकाउनु[C]होस्
[Am]नयाँ [Dm]आनन्द र [F]खुशी, [C]नयाँ [Dm]उचाई र [F]शक्ति भर्नु[C]होस् ।`
  },
  {
    id: "akash-bhanda-uchcha",
    title: "आकाशभन्दा उच्च",
    group: "Nepali",
    key: "B",
    lyrics: `## Verse 1
[B]आकाशभन्दा [D#m]उच्च  उ[E]च्च छ ना[G#m]उँ,
[E]सागरभन्दा [F#]गहिरो गहिरो छ प्रे[B]म
आसमानभन्दा [D#m]विशाल [E]विशाल [G#m]अनुग्रह
[C#m]छ हाम्रो [F#]प्रभु येशू[B]को ।

## Chorus
[B]यसैले [G#m]गर्छौं   [D#m]प्रशंसा,  [E]गाउँछौँ [F#]महिमा उनै येशूको [B]२

## Verse 2
[B]वाक्यले [D#m]व्यक्त नहुने, [G#m]भन्नलाई [E]शब्द नपुग्ने [B]प्रेम,
[B]आदिदेखि [D#m]अहिलेसम्म [G#m]समयले [E]साक्षी दिएको [B]प्रेम
[G#m]स्वर्ग छोडी [D#m]आउनुभो’ [G#m]क्रूसैमा [D#m]मर्नुभो’,
[G#m]मृत्युलाई [D#m]जित्नुभो’, [C#m]हामीलाई [F#]मुक्ति दिन[B]लाई ।

## Verse 3
[B]सारा सृष्टिले [D#m]ढोक्नेछ, [G#m]सबै   [E]घुँडाहरू [B]टेक्नेछन्,
[B]निर्बल [D#m]बलियो हुनेछ, [G#m]लाटोले [E]पुकार्नेछ त्यो [B]नाउँ
[G#m]अन्धोले [D#m]देख्नेछ, [G#m]बहिरोले [D#m]सुन्नेछ,
[G#m]मुर्दा [D#m]बिउँतनेछ   [C#m]उनैलाई [F#]महिमा [B]दिनलाई ।

## Chorus
(repeat)`
  },
  {
    id: "aru-kohi-chaina",
    title: "Aru Kohi Chaina",
    group: "Nepali",
    key: "A",
    lyrics: `## Verse 1
[A]Aru kohi chaina [F#m]aadhar ko yogya
[A]ekmatra malik ta[D]pai
[Bm]Aru kohi chaina [G]sihasanko yogya
ekmatra raja ta[A]pai (2)

## Chorus
Sara [A]aadhar sara mahi[E]ma tim[F#m]rai   [E]tim[A]rai
Sara [A]aadhar sara mahi[E]ma tim[F#m]rai   [E]tim[D]rai

## Verse 2
[A]Aru kohi chaina [F#m]mahima ko yogya
[A]Ekmatra prabhu [D]tapai
[F#m]Aru kohi chaina [G]niskalanka pabitra
[E]Ekmatra thuma ta[A]pai (2)

## Chorus
(repeat)

## Bridge
[A]Nau unko ucha
[E]Nau unko ucha
[F#m]Nau unko [D]ucha
Nau yae[A]shu (2)`
  },
  {
    id: "aaradhanale",
    title: "आराधनाले",
    group: "Nepali",
    key: "G",
    lyrics: `## Chorus
[G]आराधनाले [Em]भरिएर  [G]सुन्दरताले [Em]सजिएर (2)
त[Am]पाई मे[G]रो ये[Am]शू तपाई मेरो ये[G]शु

## Bridge
[G]मेरो ह्दयले मेरो [Em]जिवनले
मेरो [G]ह्दयले मेरो [Em]जिवनले

## Pre-Chorus
[G]आराध [C]ना   [Am]आराध [G]ना
[G]आराध [C]ना   [Am]आ   [D]रा ध[G]ना`
  },
  {
    id: "bhager-kahan-jau",
    title: "भागेर कहाँ जाउ",
    group: "Nepali",
    key: "B",
    lyrics: `## Verse 1
[B]भागेर [F#]कहाँ जाउ [E]म
[F#]अन्तमा त[E]पाईं नै चाहिन् [B]छ[F#]
[B]लुकेर [F#]कहाँ लुकु [E]म [F#]ज्योति तपा[E]ईं नै हुनुहु[B]न्छ 2 [F#]

## Chorus
[F#]आकाशमा पनि तपाईं [G#m]गहिराईमा [F#]पनि त[E]पाईं
यो [F#]भिडमा पनि [G#m]तपाईं [F#]एकतामा पनि त[E]पा[F#]ईं
हुनु[B]हुन्छ [F#]येशु हुनु[E]हुन्छ`
  },
  {
    id: "yi-din-hun-eliyako",
    title: "यी दिन हुन् एलियाको झै",
    group: "Nepali",
    key: "B",
    lyrics: `## Verse 1
[B]यी दिन हुन् एलिया[E]को झै, [B]वचन प्र[F#]चार [B]गर्ने
[B]यी दिन हुन् प्रभुको दिस [E]मोसाको झै,
[B]धार्मिकता [F#]स्थापित [B]गर्ने
यस्तै [D#m]यी दिन हुन् ठूला परी[G#m]क्षा, [C#m]अनिकाल लडाइ[F#]का
[B]हामी हौ उजाड़ स्थानमा [E]कराउने स्वर,
प्र[B]भुको बा[F#]टो बना[B]ऊ

## Chorus
[B]हेर उनि आउँछन् बादल[E]मा
सूर्य झै च[B]म्कदै तुरहीको आवाज[F#]मा
चर्को गरि [B]कराऊ छुट्काराको [E]वर्ष,
सियोनबाट अ[B]झै आउँ[F#]छ उद्धा[B]र

## Verse 2
[B]यी दिन हुन् इजकिएल[E]का झैं,
[B]सुख्खा हड्डि [F#]शरीर ब[B]न्ने
[B]यी दिन हुन् प्रभुको दास [E]दाऊदको झैं,
प्र[B]शंसा गर्ने म[F#]न्दिर ब[B]न्ने
अनि [D#m]यी दिन हुन् कटानी[G#m]का [C#m]संसारका खेतह[F#]रू
[B]हामी हौ प्रभुका [E]खेतका खेताला, व[B]चन घो[F#]षणा ग[B]र्ने

## Chorus
(repeat)

## Bridge
[B]यहोवे झै छैन ईश्वर [E]यहोवे झै छैन ईश्वर
[B]यहोवे झै छैन ईश्वर [F#]यहोवे झै छैन ईश्वर (4)

## Chorus
(repeat)`
  },
  {
    id: "gaun-halleluyah",
    title: "गाउँ हल्लेलूयाह प्रभुलाई",
    group: "Nepali",
    key: "C#m",
    lyrics: `## Verse 1
[C#m]गाउँ हल्लेलू[B]याह प्रभु[C#m]लाई
गाउँ हल्लेलू[B]याह प्रभु[C#m]लाई
[A]गाउँ हल्लेलूयाह गा[B]उँ हल्लेलूयाह
[G#]गाउँ हल्लेलू[B]याह प्रभु[C#m]लाई

## Verse 2
[C#m]येशू सं[B]सारका ज्योति [C#m]हुन्
येशू सं[B]सारका ज्योति [C#m]हुन्
[A]येशू संसारको ये[B]शू संसारको
[G#]येशू संसार[B]का ज्योति [C#m]हुन् ।

## Verse 3
[C#m]राज गर्न फे[B]रि आउने[C#m]छन्
राज गर्न फे[B]रि आउने[C#m]छन्
[A]राज गर्न फेरि रा[B]ज गर्न फेरि
[G#]राज गर्न फे[B]रि आउने[C#m]छन् ।`
  },
  {
    id: "hami-uchalau",
    title: "हामी उचालौँ महिमित थुमालाई",
    group: "Nepali",
    key: "D",
    lyrics: `## Chorus
[D]हामी उचालौँ महिमित थुमा[F#m]लाई,
हामी उ[G]चालौँ जीवित येशू[A]लाई २
गाउँदै [G]बजाउँदै, प्रशंसा ग[A]र्दै
चढ़ाऔँ धन्यवाद प्रेमी प्रभुला[D]ई २

## Verse 1
[D]हाम्रो प्रार्थनामा हामी उचा[F#m]लौँ,
हाम्रो व[G]चनमा हामी उचा[A]लौँ २
गाउँदै [G]बजाउँदै, स्तुति ग[A]र्दै,
चढ़ाऔँ धन्यवाद प्रेमी प्रभुला[D]ई २

## Verse 2
[D]प्रशंसासाथ हामी उचा[F#m]लौँ,
स्तुति ग[G]र्दै हामी उचा[A]लौँ २
गाउँदै [G]बजाउँदै, जयजयकार ग[A]र्दै,
चढ़ाऔँ धन्यवाद प्रेमी प्रभुला[D]ई २`
  },
  {
    id: "rokindin-aaradhana",
    title: "रोकिन्दिन गर्न तपाईलाई आराधना",
    group: "Nepali",
    key: "G#",
    lyrics: `## Chorus
[G#]रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
[G#]म रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई
[G#]म रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
[G#]म रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई

## Verse
[G#]कसरी म [Cm]चुप [C#]बसु
यशु [A#m]तपाईको [D#]अनुग्रहलाई [G#]देखि
[G#]कसेरी [Cm]पछी [C#]हट्टु म
यशु [A#m]तपाईको [D#]बलिदानलाई [G#]सम्झी

## Chorus
[G#]म रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
[G#]म रोकिन्दिन [Cm]गर्न [C#]तपाईलाई आरा[G#]धना
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई
आरा[A#m]धना आरा[C#]धना
आरा[A#m]धना हा [D#]हा यशु [G#]लाई`
  },
  {
    id: "tapaiko-khola-bagdai-cha",
    title: "Tapaiko Khola Bagdai Cha",
    group: "Nepali",
    key: "E",
    lyrics: `## Verse 1
[E]Tapaiko khola bag[A]dai cha
Mo tyaha [B]bata piu[E]nay chu
[E]Muduli mirga aa[A]ya jhai
Mo ufran[B]dai aau[E]naychu

## Chorus
[E]Tapaiko prem[B]lay [A]mo naya [B]hunay[E]chu
[E]Tapaiko prem[B]lay [A]mo Sudha [B]hunay[E]chu`
  },
  {
    id: "jasai-timro-aradhana-garchu",
    title: "Jasai Timro Aradhana Garchu",
    group: "Nepali",
    key: "E",
    lyrics: `## Chorus
[E]Jasai timro [A]aradhana gar[E]chu
timro mahimit [A]muharlai [B]harchu (2)
timro [A]upastithi [F#m]bhitra jaba [B]paschu pas[E]chu
timro [A]prem ko [F#m]anubhab [E]garchu
la[A]gayka [F#m]chot ra
ghat [B]hridaya[E]ko [A]ni [B]ko hun[E]cha
at[A]ma ra sa[F#m]rir ko [E]rog [A]ni [B]ko hun[B]cha (2)`
  },
  {
    id: "prabhu-timro-nimti",
    title: "Prabhu Timro Nimti",
    group: "Nepali",
    key: "D",
    lyrics: `[D]Prabhu Timro Nimti Ma Geet Gau [A]Xu
[D]Sara Utam Prayasle Ma Geet Gau [A]Xu
Ti[G]mi Xau Mero Xe[A]u, Ti[G]mi Xau Mero [D]Sath
[D](Mero Geet Le Prabhu Timi[A]lae Uuchal[D]xu)2
[D](Ye [Bm]Mera Sabda Sabda Ma, [A]Sara Uucharan Haru Ma
Aa[G]waaj Vayeka Songeet Haru [D]Ma)2
[D]Jiban Vayeraw Timi Ma Vitra [A]Xau
[D]Jiune Karan Banna Sikayeka [A]Xau
Ti[G]mi Xau Mero Xe[A]u, Ti[G]mi Xau Mero [D]Sath
[D](Mero Geet Le Prabhu Timi[A]lae Uuchal[D]xu)2`
  },
  {
    id: "hijo-aaj-sadhaibhari",
    title: "हिजोआज सधैँभरि",
    group: "Nepali",
    key: "G",
    lyrics: `## Chorus
[G]हिजोआज सधैँभरि [Em]येशू [G]समान छ[D]न्
[G]हामी फेर्छौं, [Em]येशु मा[Am]त्र
[C]कहिले फे[D]र्दैन[G]न्,
[G]उनको नामको जय, उनको नामको ज[D]य
[G]हामी फेर्छौं, [Em]येशु मा[Am]त्र
[C]कहिले फे[D]र्दैन[G]न्,`
  },
  {
    id: "jhari-pathau",
    title: "झरी पठाऊ",
    group: "Nepali",
    key: "C#m",
    lyrics: `## Chorus
झरी [C#m]पठाऊ झरी प[A]ठाऊ
[E]स्वोर्गको ढोका खोले[B]र २
तपाइको [A]प्रेमको झरी
तपाइको [C#m]आत्माको हुरी
स्वो[E]र्गको दुकदुकी सु[B]नाउ ४
झरी [C#m]पठाऊ झरी प[A]ठाऊ
[E]स्वोर्गको ढोका खोले[B]र २

## Bridge
हेर्न चा[A]हन्छु तपाइको [B]महिमा
जान्न चा[C#m]हन्छु ये[G#m/B]शु २
झरी [C#m]पठाऊ झरी प[A]ठाऊ
[E]स्वोर्गको ढोका खोले[B]र २`
  },
  {
    id: "kohi-chhaina-kohi-chhaina",
    title: "कोहि छैन कोहि छैन",
    group: "Nepali",
    key: "E",
    lyrics: `## Chorus
[E]कोहि छै[C#m]न कोहि [B]छैन
हृदय[A]ले [B]तपाईं झैं चाहे[E]को
[E]अब त बाँच्न प[C#m]नि
सक्दि[A]न [B]म तपाईं वि[C#m]ना (२)[B]
पल [E]पल म[A]लाई [B]येशू चाहि[E]न्छ
हर [C#m]क्षण म[A]लाई [B]येशू चाहि[E]न्छ`
  },
  {
    id: "mahan-prabhulai-mahima",
    title: "महान् प्रभुलाई महिमा",
    group: "Nepali",
    key: "E",
    lyrics: `## Chorus
[E]महान् प्र[A]भुलाई [B]महि[E]मा, परमप्र[A]भुलाई [B]प्रशं[E]सा
[E]यो मेरो [A]जीवन[B]को चाह[C#m]ना (हल्लेलू[A]या [B]ह होस[E]न्ना) २

## Verse 1
[E]वर्तमान [A]मेरो तपाईंको हात[E]मा, भविष्य प[C#m]नि तपाईंको सा[B]थमा
आनन्दि[A]त छु, [E]शान्तिमा छु,
प्रभु[A]हरूका [B]प्रभु[E]मा २

## Verse 2
[E]सर्वाङ्ग [A]मेरो येशूको हात[E]मा
अर्प[C#m]ण गर्छु, धन्य[B]वादसाथमा
छु [A]निर्धक्क [E]छु,
राजाह[A]रू का [B]राजा[E]मा २`
  }
];

window.SERVICES = [
  {
    date: "2026-10-17",
    starter: ["bhajan-12", "what-a-friend"],
    worship: ["blessed-assurance", "worship-sample", "amazing-grace", "malai-tapaiko-khancho"],
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
