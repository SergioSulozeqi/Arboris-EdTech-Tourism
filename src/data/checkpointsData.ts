import { Checkpoint, RouteLevel } from '../types';

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'museo',
    order: 1,
    code: 'CHECKPOINT 01',
    name: 'Museo del Priaboniano',
    subtitle: '"Renato Gasparella" · Priabona',
    altitude: 275,
    locationDescription: 'Via Chiesa 1, Frazione Priabona, Monte di Malo (VI)',
    coordinates: {
      x: 78,
      y: 84,
      lat: 45.6568,
      lng: 11.3934,
    },
    floraAmbiente: [
      'Boschi termofili di roverella, carpino nero, orniello, castagno e nocciolo (250–400 m)',
      'Sottobosco di biancospino, corniolo, ligustro e rovo lungo prati e coltivi',
    ],
    faunaChiViveQui: [
      'Capriolo, volpe, tasso e scoiattolo rosso tra coltivi e margini del bosco',
      'Poiana che si libra in cerchio e gheppio in "spirito santo" a caccia di roditori',
      'Ghiandaia che d\'autunno nasconde ghiande e castagne, propagando il bosco',
    ],
    curiositaGeologia:
      'Priabona dà il nome al PRIABONIANO, l\'ultimo piano dell\'Eocene (37,7–33,9 milioni di anni fa): qui c\'era un mare tropicale. Nelle marne dormono nummuliti, coralli, il sirenide Prototherium e i denti dello squalo gigante Otodus sokolovi.',
    audioGuideText:
      'Benvenuti al Checkpoint 01, il Museo Paleontologico del Priaboniano "Renato Gasparella". Sapevate che milioni di anni fa questa vallata era sommersa da un caldo mare tropicale popolato da squali giganti e sirenidi? Proprio qui a Priabona i geologi di tutto il mondo hanno definito lo stratotipo del Priaboniano.',
    tag: 'Paleontologia & Boschi Termofili',
    color: '#84cc16', // lime-500
    quiz: {
      id: 'quiz-museo',
      question: 'Cosa ricopriva l\'area di Priabona durante l\'epoca geologica dell\'Eocene (Priaboniano)?',
      options: [
        'Un ghiacciaio perenne delle Alpi',
        'Un caldo mare tropicale ricco di coralli e squali fossili',
        'Un deserto di dune sabbiose vulcaniche',
        'Una fitta foresta boreale di conifere',
      ],
      correctIndex: 1,
      explanation:
        'Esatto! Durante il Priaboniano (37,7–33,9 milioni di anni fa), l\'area era un mare tropicale dove vivevano nummuliti, sirenidi come il Prototherium e squali giganteschi!',
      curiosity:
        'Lo stratotipo di Priabona è un riferimento scientifico di valore mondiale approvato dalla Commissione Internazionale di Stratigrafia.',
    },
    miniGame: {
      type: 'fossil-hunt',
      title: 'Scavo Paleontologico del Priaboniano',
      subtitle: 'Trova i 3 reperti fossili nascosti nella marna marina',
      instructions: 'Spazzola e clicca sulle formazioni rocciose per estrarre Nummuliti, Denti di Squalo e il Sirenide Prototherium!',
      rewardBadgeId: 'badge-paleo',
      rewardBadgeName: 'Paleontologo dell\'Eocene',
      rewardXp: 150,
    },
    badge: {
      id: 'badge-paleo',
      name: 'Paleontologo dell\'Eocene',
      icon: 'Shell',
      description: 'Hai esplorato le profondità del mare tropicale del Priaboniano!',
    },
  },
  {
    id: 'fontana-xotta',
    order: 2,
    code: 'CHECKPOINT 02',
    name: 'Fontana dei Xotta',
    subtitle: 'Via Xotta, Monte di Malo · ≈ 300 m',
    altitude: 300,
    locationDescription: 'Antica mulattiera Priabona-Campipiani, Via Xotta',
    coordinates: {
      x: 65,
      y: 69,
      lat: 45.6642,
      lng: 11.3812,
    },
    floraAmbiente: [
      'Bosco misto di carpino nero, castagno, roverella, acero campestre e nocciolo',
      'Felci, muschi ed edera sui muretti a secco; anemoni e primule in primavera',
    ],
    faunaChiViveQui: [
      'Rane, rospi e tritoni depongono le uova nelle vasche in primavera',
      'Libellule (con larve acquatiche) attratte dall\'acqua sorgiva corrente',
      'Punto d\'abbeverata vitale per caprioli, volpi e tassi nelle estati siccitose',
    ],
    curiositaGeologia:
      'Fontana-lavatoio di metà Ottocento, restaurata con cura nel 2004: presenta tre vasche con funzioni precise – abbeveratoio (lábio), lavatoio per i panni e fontanello per l\'acqua potabile. Tappa storica lungo la mulattiera Priabona-Campipiani.',
    audioGuideText:
      'Siete giunti alla suggestiva Fontana dei Xotta a 300 metri di quota. Questo antico lavatoio dell\'Ottocento non serviva solo alla comunità rurale, ma rappresenta tutt\'oggi un\'oasi preziosa per la fauna montana, dove anfibi protetti come tritoni e rane trovano un rifugio sicuro.',
    tag: 'Fontane Storiche & Biodiversità Acquatica',
    color: '#06b6d4', // cyan-500
    quiz: {
      id: 'quiz-xotta',
      question: 'Come si chiama tradizionalmente la vasca adibita ad abbeveratoio per il bestiame nella Fontana dei Xotta?',
      options: [
        'Il Fontanello',
        'Il Lábio',
        'La Cuna',
        'La Roggia',
      ],
      correctIndex: 1,
      explanation:
        'Corretto! Il "lábio" è la prima vasca di scolo utilizzata storicamente come abbeveratoio per gli animali, separata dal lavatoio e dalla sorgente potabile!',
      curiosity:
        'La fontana fu restaurata nel 2004 preservando le pietre originali e la canalizzazione naturale sorgiva.',
    },
    miniGame: {
      type: 'water-basins',
      title: 'Il Circuito delle Tre Vasche',
      subtitle: 'Collega la corretta funzione a ciascuna vasca storica',
      instructions: 'Canalizza l\'acqua sorgiva e assegna la funzione esatta: Abbeveratoio (Lábio), Lavatoio e Fontanello Potabile!',
      rewardBadgeId: 'badge-water',
      rewardBadgeName: 'Custode delle Sorgenti',
      rewardXp: 150,
    },
    badge: {
      id: 'badge-water',
      name: 'Custode delle Sorgenti',
      icon: 'Droplets',
      description: 'Hai compreso l\'ingegno idraulico rurale e tutelato l\'habitat degli anfibi!',
    },
  },
  {
    id: 'faedo-casaron',
    order: 3,
    code: 'CHECKPOINT 03',
    name: 'Altopiano del Faedo Casaron & Buso della Rana',
    subtitle: 'Faedo Casaron / Buso della Rana · ≈ 450 m',
    altitude: 450,
    locationDescription: 'Parco del Buso della Rana, Monte di Malo',
    coordinates: {
      x: 42,
      y: 60,
      lat: 45.6698,
      lng: 11.3645,
    },
    floraAmbiente: [
      'Altopiano carsico con doline, inghiottitoi e radure erbose ricche di elleboro e bucaneve',
      'Boschi freschi di latifoglie con prevalenza di carpino bianco, orniello e faggio nelle zone d\'ombra',
    ],
    faunaChiViveQui: [
      'Colonie di pipistrelli chirotteri (ferro di cavallo maggiore e minore, vespertilio) nelle cavità ipogee',
      'Rana temporaria e rana agile (dalmatina), salamandra pezzata e gamberi di torrente nei ruscelli carsici',
      'In queste zone i ricercatori contano le rane una ad una: ad oggi risultano ben 32.853 rane monitorate!',
    ],
    curiositaGeologia:
      'Il Buso della Rana è la cavità carsica a sviluppo orizzontale più estesa del Veneto, con oltre 28 chilometri di gallerie esplorate. Uno scrigno geologico e biospeleologico protetto.',
    audioGuideText:
      'Benvenuti all\'Altopiano del Faedo e al complesso del Buso della Rana. Camminate sopra una vera e propria città sotterranea di roccia calcarea scavata dall\'acqua. Tenete gli occhi aperti lungo il sentiero per avvistare le famose rane!',
    tag: 'Carsismo & Speleologia',
    color: '#10b981', // emerald-500
    quiz: {
      id: 'quiz-faedo',
      question: 'Quante rane risultano monitorate e contate dai ricercatori nell\'area di Monte di Malo secondo il censimento naturalistico?',
      options: [
        'Circa 1.200 rane',
        'Esattamente 32.853 rane',
        'Meno di 500 esemplari rari',
        'Oltre 1 milione di rane',
      ],
      correctIndex: 1,
      explanation:
        'Esatto! Come documentato dalle ricerche naturalistiche locali di Monte di Malo, i ricercatori hanno contato con cura 32.853 rane!',
      curiosity:
        'Il Buso della Rana possiede un microclima interno costante a circa 11°C tutto l\'anno, ideale per il letargo dei pipistrelli.',
    },
    miniGame: {
      type: 'frog-counter',
      title: 'Il Grande Censimento delle Rane',
      subtitle: 'Aiuta i ricercatori a contare le rane che saltano tra le doline carsiche!',
      instructions: 'Clicca con prontezza sulle rane agili che compaiono tra i muschi e le cavità rocciose prima che scadano i 15 secondi!',
      rewardBadgeId: 'badge-speleo',
      rewardBadgeName: 'Speleologo delle Rane',
      rewardXp: 180,
    },
    badge: {
      id: 'badge-speleo',
      name: 'Speleologo delle Rane',
      icon: 'Compass',
      description: 'Hai esplorato il cuore carsico del Buso della Rana e censito la fauna anfibia!',
    },
  },
  {
    id: 'parco-agane',
    order: 4,
    code: 'CHECKPOINT 04',
    name: 'Parco Natura Aganè',
    subtitle: 'Località Cazzola / Sette, Monte di Malo · ≈ 380 m',
    altitude: 380,
    locationDescription: 'Località Sette / Parco Natura Aganè',
    coordinates: {
      x: 52,
      y: 35,
      lat: 45.6812,
      lng: 11.3789,
    },
    floraAmbiente: [
      'Castagneti monumentali da frutto, ontani neri lungo i corsi d\'acqua sorgivi e betulle',
      'Prati umidi con fioriture di orchidee selvatiche autoctone e piante officinali alpine',
    ],
    faunaChiViveQui: [
      'Picchio rosso maggiore, picchio verde, allocco e gufo comune nei tronchi cavi',
      'Lucciole nei mesi estivi e oltre 40 specie di farfalle diurne censite',
      'Tasso, faina e donnola nei calti boschivi riparati',
    ],
    curiositaGeologia:
      'Il parco prende il nome dalle "Agane", creature leggendarie dei boschi e delle fonti nella mitologia alpina e veneta: donne custodi delle acque, maestre nella tessitura e conoscitrici dei segreti curativi della natura.',
    audioGuideText:
      'Ci troviamo nel Parco Natura Aganè. Respirate a pieni polmoni il profumo dei castagni secolari. La leggenda narra che qui le Agane insegnavano agli antichi abitanti come curare gli alberi e rispettare i cicli delle sorgenti.',
    tag: 'Miti Alpini & Castagneti Monumentali',
    color: '#a855f7', // purple-500
    quiz: {
      id: 'quiz-agane',
      question: 'Chi sono le "Agane" secondo la tradizione mitologica e folcloristica dell\'arco alpino e veneto?',
      options: [
        'Giganti di pietra che scagliano massi dalle vette',
        'Spiriti femminili custodi delle sorgenti, dei boschi e dei segreti delle piante',
        'Uccelli notturni portatori di tempeste',
        'Antichi cavalieri medievali a guardia dei castelli',
      ],
      correctIndex: 1,
      explanation:
        'Bravissimo! Le Agane sono magiche figure acquatiche e silvestri, protettrici delle fonti pure e delle tradizioni botaniche.',
      curiosity:
        'I castagneti di questa zona fornivano la farina di castagne indispensabile durante i rigidi inverni contadini del passato.',
    },
    miniGame: {
      type: 'tree-herb',
      title: 'L\'Erbario Segreto delle Agane',
      subtitle: 'Riconosci le foglie e le essenze del bosco di Monte di Malo',
      instructions: 'Associa le foglie corrette agli alberi montani (Roverella, Castagno secolare, Carpino nero) per sbloccare l\'elisir del bosco!',
      rewardBadgeId: 'badge-botany',
      rewardBadgeName: 'Custode delle Agane',
      rewardXp: 160,
    },
    badge: {
      id: 'badge-botany',
      name: 'Custode delle Agane',
      icon: 'Leaf',
      description: 'Hai appreso i segreti botanici e la magia naturale dei castagneti secolari!',
    },
  },
  {
    id: 'san-vittore',
    order: 5,
    code: 'CHECKPOINT 05',
    name: 'Oratorio di San Vittore',
    subtitle: 'Colle San Vittore · ≈ 420 m',
    altitude: 420,
    locationDescription: 'Sommità del Colle di San Vittore, Monte di Malo',
    coordinates: {
      x: 32,
      y: 20,
      lat: 45.6885,
      lng: 11.3698,
    },
    floraAmbiente: [
      'Prati aridi calcarei (magredi collinari) con timo serpillo, origano selvatico e salvia dei prati',
      'Filari di cipressi secolari e lecci panoramici a coronamento della collina storica',
    ],
    faunaChiViveQui: [
      'Falco pellegrino in caccia termica e rondone maggiore che nidifica sulle pareti rocciose',
      'Lepre comune nei prati aperti e lucertola muraiola sulle pietre calcaree soleggiate',
    ],
    curiositaGeologia:
      'Antico oratorio campestre risalente all\'epoca medievale, eretto su un punto strategico di vedetta: offre uno straordinario panorama a 360° sulla pianura veneta, sulla Val Leogra e sulle guglie delle Piccole Dolomiti.',
    audioGuideText:
      'Congratulazioni, avete raggiunto l\'Oratorio di San Vittore a 420 metri di quota! Dalla terrazza naturale potete ammirare la maestosità delle Piccole Dolomiti e l\'intera vallata di Monte di Malo. Qui si conclude il percorso Arboris!',
    tag: 'Panorama 360° & Storia Medievale',
    color: '#eab308', // yellow-500
    quiz: {
      id: 'quiz-vittore',
      question: 'Quale maestosa catena montuosa si ammira all\'orizzonte guardando verso nord-ovest dall\'Oratorio di San Vittore?',
      options: [
        'Gli Appennini Tosco-Emiliani',
        'Le Piccole Dolomiti e il Monte Pasubio',
        'Il Monte Bianco e il Cervino',
        'I Colli Euganei',
      ],
      correctIndex: 1,
      explanation:
        'Esatto! Dall\'Oratorio di San Vittore si gode di una veduta spettacolare sulle Piccole Dolomiti, il Monte Pasubio e il Monte Novegno!',
      curiosity:
        'L\'oratorio è stato per secoli meta di pellegrinaggi propiziatori per il raccolto agricolo e punto di orientamento per i viandanti.',
    },
    miniGame: {
      type: 'skyline-panorama',
      title: 'Lo Skyline delle Piccole Dolomiti',
      subtitle: 'Identifica le vette montane nel panorama a 360° e ricevi il Sigillo d\'Oro',
      instructions: 'Trascina e allinea i cartelli delle vette (Pasubio, Carega, Novegno, Summano) per completare la mappa panoramica!',
      rewardBadgeId: 'badge-summit',
      rewardBadgeName: 'Gran Maestro di Arboris',
      rewardXp: 200,
    },
    badge: {
      id: 'badge-summit',
      name: 'Gran Maestro di Arboris',
      icon: 'Award',
      description: 'Hai completato tutti i 5 checkpoint e conquistato la vetta di San Vittore!',
    },
  },
];

export const ROUTE_LEVELS: RouteLevel[] = [
  {
    id: 'family',
    name: 'Anello Famiglia & Natura',
    badge: 'Livello Verde',
    distanceKm: 6.5,
    durationHours: '2h 15m',
    elevationGainM: 180,
    difficulty: 'Facile',
    description: 'Ideale per famiglie con bambini e camminatori rilassati. Tocca il Museo del Priaboniano, la Fontana dei Xotta e i sentieri boschivi con pendenze dolci.',
    targetAudience: 'Famiglie, bambini, principianti',
    checkpointIds: ['museo', 'fontana-xotta', 'parco-agane'],
  },
  {
    id: 'explorer',
    name: 'Sentiero Speleo & Botanico',
    badge: 'Livello Blu',
    distanceKm: 11.2,
    durationHours: '3h 30m',
    elevationGainM: 320,
    difficulty: 'Medio',
    description: 'Percorso emozionante che esplora le doline carsiche dell\'Altopiano del Faedo, l\'ingresso del Buso della Rana e la fontana storica.',
    targetAudience: 'Appassionati di natura, geologia, trekking medio',
    checkpointIds: ['museo', 'fontana-xotta', 'faedo-casaron', 'parco-agane'],
  },
  {
    id: 'grand-tour',
    name: 'Gran Tour Integrale Arboris',
    badge: 'Livello Esperto',
    distanceKm: 20.6,
    durationHours: '5h 00m',
    elevationGainM: 580,
    difficulty: 'Impegnativo',
    description: 'L\'itinerario completo di Monte di Malo come da progetto ufficiale (20,6 km): tocca tutti i 5 totem strategici fino alla vetta panoramica di San Vittore.',
    targetAudience: 'Escursionisti, gruppi sportivi, cacciatori di tesori',
    checkpointIds: ['museo', 'fontana-xotta', 'faedo-casaron', 'parco-agane', 'san-vittore'],
  },
];

export const ALL_BADGES = [
  {
    id: 'badge-first-step',
    name: 'Primo Passo nel Bosco',
    icon: 'Footprints',
    description: 'Hai avviato il tuo primo percorso esplorativo Arboris.',
  },
  {
    id: 'badge-paleo',
    name: 'Paleontologo dell\'Eocene',
    icon: 'Shell',
    description: 'Hai completato il quiz e lo scavo fossile al Museo del Priaboniano.',
  },
  {
    id: 'badge-water',
    name: 'Custode delle Sorgenti',
    icon: 'Droplets',
    description: 'Hai compreso il funzionamento delle tre vasche alla Fontana dei Xotta.',
  },
  {
    id: 'badge-speleo',
    name: 'Speleologo delle Rane',
    icon: 'Compass',
    description: 'Hai contato le rane del Buso della Rana e studiato il carsismo.',
  },
  {
    id: 'badge-botany',
    name: 'Custode delle Agane',
    icon: 'Leaf',
    description: 'Hai svelato i segreti botanici dei castagneti al Parco Natura Aganè.',
  },
  {
    id: 'badge-summit',
    name: 'Gran Maestro di Arboris',
    icon: 'Award',
    description: 'Hai raggiunto la sommità dell\'Oratorio di San Vittore con vista Piccole Dolomiti.',
  },
];
