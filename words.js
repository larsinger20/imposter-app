// Wortliste: [Wort, Tipp für die Imposter]
// Der Tipp ist bewusst eine LOSE Assoziation, die auf viele Wörter passen könnte –
// er soll dem Imposter helfen mitzureden, das Wort aber nicht verraten.
// WICHTIG: Neue Wörter nur am ENDE einer Kategorie anhängen und neue Kategorien nur am ENDE der Liste –
// sonst bekommen Handys mit alter und neuer Version unterschiedliche Wörter für denselben Code.
const CATEGORIES = [
  {
    id: "essen", name: "Essen & Trinken", emoji: "🍕",
    words: [
      ["Pizza", "Lieferdienst"], ["Sushi", "Roh"], ["Döner", "Imbiss"], ["Spaghetti", "Gabel"],
      ["Schokolade", "Süß"], ["Kaffee", "Morgen"], ["Bier", "Kasten"], ["Wein", "Keller"],
      ["Pommes", "Beilage"], ["Burger", "Amerika"], ["Eis", "Kalt"], ["Popcorn", "Snack"],
      ["Brezel", "Bäcker"], ["Honig", "Klebrig"], ["Käse", "Kühlschrank"], ["Suppe", "Warm"],
      ["Salat", "Gesund"], ["Pfannkuchen", "Sonntag"], ["Banane", "Obst"], ["Erdbeere", "Sommer"],
      ["Zitrone", "Gelb"], ["Knoblauch", "Geruch"], ["Croissant", "Frühstück"], ["Tee", "Heiß"],
      ["Champagner", "Feier"], ["Wassermelone", "Picknick"], ["Currywurst", "Soße"], ["Lebkuchen", "Advent"],
      ["Spiegelei", "Morgens"], ["Müsli", "Schüssel"], ["Lasagne", "Auflauf"], ["Gulasch", "Eintopf"],
      ["Schnitzel", "Klopfen"], ["Bratwurst", "Stadion"], ["Sauerkraut", "Fass"], ["Apfelstrudel", "Nachtisch"],
      ["Tiramisu", "Löffel"], ["Cola", "Koffein"], ["Orangensaft", "Glas"], ["Avocado", "Grün"],
      ["Toast", "Knusprig"], ["Nutella", "Streichen"], ["Senf", "Tube"], ["Gurke", "Glas"],
      ["Karotte", "Orange"], ["Zwiebel", "Schälen"], ["Pilz", "Herbst"], ["Kürbis", "Kerne"],
      ["Ananas", "Tropen"], ["Kokosnuss", "Hart"], ["Kirsche", "Kern"], ["Donut", "Ring"],
      ["Waffel", "Kirmes"], ["Gummibärchen", "Tüte"], ["Cocktail", "Bar"], ["Glühwein", "Winter"],
      ["Milch", "Weiß"], ["Ei", "Schale"], ["Raclette", "Silvester"], ["Fondue", "Spieß"],
      ["Taco", "Scharf"], ["Pudding", "Vanille"], ["Torte", "Stück"], ["Zuckerwatte", "Rosa"],
      ["Kaugummi", "Pfefferminz"], ["Lakritz", "Geschmackssache"], ["Apfel", "Saft"], ["Kartoffelsalat", "Party"],
      ["Frikadelle", "Rund"], ["Maultaschen", "Teig"], ["Weißwurst", "Vormittag"], ["Hummus", "Dip"]
    ]
  },
  {
    id: "tiere", name: "Tiere", emoji: "🦁",
    words: [
      ["Löwe", "König"], ["Elefant", "Groß"], ["Pinguin", "Frack"], ["Giraffe", "Lang"],
      ["Hai", "Gefährlich"], ["Katze", "Haustier"], ["Hund", "Treu"], ["Pferd", "Stall"],
      ["Kuh", "Weide"], ["Schwein", "Bauernhof"], ["Adler", "Fliegen"], ["Eule", "Weise"],
      ["Schlange", "Häuten"], ["Krokodil", "Tränen"], ["Känguru", "Hüpfen"], ["Delfin", "Klug"],
      ["Spinne", "Acht"], ["Schmetterling", "Bunt"], ["Biene", "Fleißig"], ["Frosch", "Grün"],
      ["Igel", "Kugel"], ["Eichhörnchen", "Flink"], ["Papagei", "Käfig"], ["Kamel", "Durst"],
      ["Wal", "Riesig"], ["Fuchs", "Rot"], ["Panda", "Schwarz-weiß"], ["Schnecke", "Schleim"],
      ["Affe", "Urwald"], ["Bär", "Brummen"], ["Wolf", "Rudel"], ["Hase", "Ohren"],
      ["Maus", "Klein"], ["Ratte", "Schwanz"], ["Huhn", "Körner"], ["Ente", "Schnabel"],
      ["Gans", "Daunen"], ["Schaf", "Herde"], ["Ziege", "Berge"], ["Esel", "Lasten"],
      ["Zebra", "Afrika"], ["Tiger", "Indien"], ["Leopard", "Schnell"], ["Nashorn", "Dick"],
      ["Nilpferd", "Schwer"], ["Gorilla", "Stark"], ["Koala", "Schläfrig"], ["Faultier", "Hängen"],
      ["Krake", "Tinte"], ["Qualle", "Brennen"], ["Seestern", "Meeresboden"], ["Krabbe", "Seitwärts"],
      ["Hummer", "Teuer"], ["Goldfisch", "Glas"], ["Schildkröte", "Alt"], ["Fledermaus", "Dunkelheit"],
      ["Marienkäfer", "Glück"], ["Ameise", "Viele"], ["Mücke", "Summen"], ["Storch", "Nest"],
      ["Flamingo", "Ein Bein"], ["Pfau", "Eitel"], ["Specht", "Holz"], ["Hamster", "Backen"],
      ["Dinosaurier", "Urzeit"], ["Hirsch", "Röhren"], ["Maulwurf", "Garten"], ["Biber", "Zähne"],
      ["Robbe", "Fisch"], ["Eisbär", "Weiß"], ["Wildschwein", "Borsten"], ["Kolibri", "Nektar"]
    ]
  },
  {
    id: "orte", name: "Orte", emoji: "🏖️",
    words: [
      ["Strand", "Sonnencreme"], ["Krankenhaus", "Besuchszeit"], ["Flughafen", "Warten"], ["Schule", "Pause"],
      ["Kino", "Dunkel"], ["Supermarkt", "Regal"], ["Bahnhof", "Verspätung"], ["Zoo", "Eintritt"],
      ["Bibliothek", "Ausweis"], ["Fitnessstudio", "Mitgliedschaft"], ["Kirche", "Sonntag"], ["Friedhof", "Ruhe"],
      ["Restaurant", "Reservierung"], ["Schwimmbad", "Handtuch"], ["Gefängnis", "Strafe"], ["Museum", "Alt"],
      ["Freizeitpark", "Schlange stehen"], ["Bäckerei", "Früh"], ["Bauernhof", "Land"], ["Wald", "Spaziergang"],
      ["Berg", "Aussicht"], ["Insel", "Boot"], ["Wüste", "Weite"], ["Club", "Wochenende"],
      ["Campingplatz", "Natur"], ["Tankstelle", "Nachts"], ["Hotel", "Zimmer"], ["Spielplatz", "Kinder"],
      ["Bank", "Geld"], ["Post", "Schalter"], ["Rathaus", "Formular"], ["Kindergarten", "Mittagsschlaf"],
      ["Universität", "Semester"], ["Stadion", "Laut"], ["Theater", "Applaus"], ["Casino", "Chips"],
      ["Zirkus", "Zelt"], ["Jahrmarkt", "Lose"], ["Weihnachtsmarkt", "Kalt"], ["Baumarkt", "Heimwerken"],
      ["Apotheke", "Rezept"], ["Sauna", "Heiß"], ["Leuchtturm", "Nacht"], ["Burg", "Mauern"],
      ["Schloss", "Adel"], ["Höhle", "Echo"], ["Hafen", "Möwen"], ["Autobahn", "Schnell"],
      ["Kneipe", "Abend"], ["Waschsalon", "Münzen"], ["Bushaltestelle", "Regen"], ["Kaufhaus", "Etagen"],
      ["Polizeiwache", "Anzeige"], ["Feuerwache", "Alarm"], ["Gewächshaus", "Glas"], ["Kreuzfahrtschiff", "Rentner"],
      ["Eisdiele", "Sommer"], ["Tiefgarage", "Beton"], ["Wartezimmer", "Termin"], ["Dachboden", "Staub"],
      ["Keller", "Kühl"], ["Solarium", "Braun"], ["Golfplatz", "Rasen"], ["Raumstation", "Umlaufbahn"]
    ]
  },
  {
    id: "berufe", name: "Berufe", emoji: "👩‍🚒",
    words: [
      ["Feuerwehrmann", "Held"], ["Polizist", "Gesetz"], ["Arzt", "Praxis"], ["Lehrer", "Ferien"],
      ["Koch", "Mütze"], ["Pilot", "Reisen"], ["Bäcker", "Früh aufstehen"], ["Friseur", "Termin"],
      ["Astronaut", "Training"], ["Richter", "Robe"], ["Zauberer", "Trick"], ["Clown", "Schminke"],
      ["Gärtner", "Grün"], ["Fotograf", "Hochzeit"], ["Mechaniker", "Öl"], ["Postbote", "Tour"],
      ["Tierarzt", "Behandlung"], ["Pirat", "Flagge"], ["Detektiv", "Fall"], ["Bauarbeiter", "Laut"],
      ["Sänger", "Stimme"], ["Schauspieler", "Film"], ["Kapitän", "Verantwortung"], ["Programmierer", "Büro"],
      ["Krankenpfleger", "Station"], ["Metzger", "Theke"], ["Taxifahrer", "Nachts"], ["Busfahrer", "Fahrplan"],
      ["Elektriker", "Strom"], ["Klempner", "Wasser"], ["Maler", "Wand"], ["Tischler", "Säge"],
      ["Bauer", "Früh"], ["Fischer", "Meer"], ["Anwalt", "Akten"], ["Journalist", "Interview"],
      ["Kellner", "Tablett"], ["Bankberater", "Beratung"], ["Soldat", "Befehl"], ["Model", "Schön"],
      ["Influencer", "Reichweite"], ["Bibliothekar", "Ruhe"], ["Zahnarzt", "Angst"], ["Hebamme", "Neugeboren"],
      ["Bestatter", "Schwarz"], ["Schornsteinfeger", "Dach"], ["Archäologe", "Geschichte"], ["Wissenschaftler", "Forschung"],
      ["Architekt", "Gebäude"], ["DJ", "Nacht"], ["Balletttänzer", "Anmut"], ["Schiedsrichter", "Pfiff"],
      ["Flugbegleiter", "Lächeln"], ["Kassierer", "Schlange"], ["Hausmeister", "Reparatur"], ["Müllmann", "Orange"],
      ["Dachdecker", "Höhe"], ["Förster", "Natur"], ["Imker", "Schutzanzug"], ["Winzer", "Herbst"],
      ["Politiker", "Rede"], ["Butler", "Reich"], ["Psychologe", "Gespräch"], ["Spion", "Geheimnis"]
    ]
  },
  {
    id: "dinge", name: "Gegenstände", emoji: "🔦",
    words: [
      ["Regenschirm", "Aufspannen"], ["Schlüssel", "Verlieren"], ["Brille", "Optiker"], ["Zahnbürste", "Morgens"],
      ["Kerze", "Romantisch"], ["Uhr", "Pünktlich"], ["Spiegel", "Badezimmer"], ["Kissen", "Schlaf"],
      ["Gitarre", "Holz"], ["Kühlschrank", "Küche"], ["Staubsauger", "Laut"], ["Hammer", "Werkzeug"],
      ["Luftballon", "Party"], ["Taschenlampe", "Dunkel"], ["Teppich", "Wohnzimmer"], ["Koffer", "Rollen"],
      ["Schere", "Basteln"], ["Kamm", "Bad"], ["Wecker", "Morgen"], ["Leiter", "Hoch"],
      ["Sonnenbrille", "Cool"], ["Würfel", "Glück"], ["Krone", "Gold"], ["Klavier", "Schwer"],
      ["Schlagzeug", "Laut"], ["Geige", "Orchester"], ["Trompete", "Blech"], ["Bett", "Schlafzimmer"],
      ["Sofa", "Gemütlich"], ["Lampe", "Strom"], ["Stuhl", "Holz"], ["Gabel", "Essen"],
      ["Messer", "Küche"], ["Kochtopf", "Wasser"], ["Mikrowelle", "Schnell"], ["Waschmaschine", "Keller"],
      ["Bügeleisen", "Heiß"], ["Handtuch", "Strand"], ["Seife", "Hände"], ["Klopapier", "Hamsterkauf"],
      ["Kugelschreiber", "Schreiben"], ["Bleistift", "Holz"], ["Radiergummi", "Schule"], ["Buch", "Lesen"],
      ["Kalender", "Wand"], ["Brief", "Post"], ["Geldbeutel", "Tasche"], ["Feuerzeug", "Raucher"],
      ["Klebeband", "Basteln"], ["Teddybär", "Kinderzimmer"], ["Schnuller", "Baby"], ["Besen", "Sauber"],
      ["Blumenvase", "Wasser"], ["Bilderrahmen", "Wand"], ["Sanduhr", "Zeit"], ["Kompass", "Wandern"],
      ["Fernglas", "Vögel"], ["Anker", "Hafen"], ["Mülleimer", "Küche"], ["Gießkanne", "Garten"],
      ["Wäscheklammer", "Draußen"], ["Briefmarke", "Hobby"], ["Schaukel", "Garten"], ["Zahnstocher", "Restaurant"],
      ["Kleiderbügel", "Kleidung"], ["Fußmatte", "Haustür"], ["Schneekugel", "Andenken"], ["Kronleuchter", "Prunk"]
    ]
  },
  {
    id: "freizeit", name: "Sport & Freizeit", emoji: "⚽",
    words: [
      ["Fußball", "Mannschaft"], ["Tennis", "Weiß"], ["Skifahren", "Winterurlaub"], ["Schwimmen", "Nass"],
      ["Basketball", "Groß"], ["Golf", "Reich"], ["Boxen", "Kampf"], ["Yoga", "Dehnen"],
      ["Bowling", "Schuhe"], ["Schach", "Denken"], ["Karaoke", "Peinlich"], ["Angeln", "Geduld"],
      ["Surfen", "Brett"], ["Klettern", "Halle"], ["Tanzen", "Musik"], ["Grillen", "Sommer"],
      ["Wandern", "Natur"], ["Joggen", "Morgens"], ["Darts", "Zielen"], ["Poker", "Geld"],
      ["Zelten", "Draußen"], ["Videospiele", "Level"], ["Malen", "Kunst"], ["Reiten", "Tier"],
      ["Volleyball", "Sand"], ["Handball", "Halle"], ["Eishockey", "Kalt"], ["Eiskunstlauf", "Eleganz"],
      ["Snowboard", "Brett"], ["Skateboard", "Rollen"], ["Radrennen", "Sommer"], ["Marathon", "Lang"],
      ["Formel 1", "Laut"], ["Rudern", "Team"], ["Tauchen", "Tief"], ["Fallschirmspringen", "Mut"],
      ["Bungee-Jumping", "Adrenalin"], ["Tischtennis", "Keller"], ["Badminton", "Leicht"], ["Billard", "Kugeln"],
      ["Minigolf", "Urlaub"], ["Monopoly", "Streit"], ["Memory", "Gedächtnis"], ["Puzzle", "Geduld"],
      ["Kreuzworträtsel", "Zeitung"], ["Sudoku", "Logik"], ["Stricken", "Oma"], ["Kochen", "Küche"],
      ["Segeln", "Boot"], ["Kanu", "Fluss"], ["Judo", "Anzug"], ["Fechten", "Maske"],
      ["Paintball", "Wald"], ["Lasertag", "Dunkel"], ["Escape Room", "Zeitdruck"], ["Schnitzeljagd", "Kinder"],
      ["Verstecken", "Suchen"], ["Schneeballschlacht", "Kalt"], ["Sandburg", "Kinder"], ["Trampolin", "Garten"],
      ["Bierpong", "Party"], ["Gewichtheben", "Schwer"], ["Wasserski", "See"], ["Kartenhaus", "Einsturz"]
    ]
  },
  {
    id: "feste", name: "Feste & Ereignisse", emoji: "🎉",
    words: [
      ["Weihnachten", "Familie"], ["Ostern", "Frühling"], ["Halloween", "Gruselig"], ["Silvester", "Mitternacht"],
      ["Hochzeit", "Feier"], ["Geburtstag", "Älter"], ["Karneval", "Februar"], ["Oktoberfest", "Zelt"],
      ["Beerdigung", "Abschied"], ["Abiball", "Abschluss"], ["Junggesellenabschied", "Peinlich"], ["Valentinstag", "Liebe"],
      ["Festival", "Matsch"], ["Taufe", "Wasser"], ["Umzug", "Schleppen"], ["Urlaub", "Sonne"],
      ["Einschulung", "Aufregung"], ["Muttertag", "Mai"], ["Nikolaus", "Dezember"], ["Sankt Martin", "Pferd"],
      ["Erntedank", "Dankbar"], ["Einweihungsparty", "Gäste"], ["Klassentreffen", "Erinnerungen"], ["Familienfeier", "Oma"],
      ["Weltmeisterschaft", "Vier Jahre"], ["Olympische Spiele", "Ringe"], ["Konzert", "Tickets"], ["Heiratsantrag", "Frage"],
      ["Babyparty", "Geschenke"], ["Führerscheinprüfung", "Nervös"], ["Vorstellungsgespräch", "Anzug"], ["Erstes Date", "Nervös"],
      ["Scheidung", "Streit"], ["Ruhestand", "Alter"], ["Wahl", "Sonntag"], ["Flohmarkt", "Feilschen"],
      ["Polterabend", "Scherben"], ["Mondlandung", "1969"], ["Eurovision Song Contest", "Europa"], ["Black Friday", "Shopping"],
      ["Ramadan", "Abends"], ["Adventskalender", "Dezember"], ["Schulabschluss", "Feier"], ["Pyjamaparty", "Kissen"],
      ["Grillparty", "Garten"], ["Hochzeitstag", "Erinnerung"], ["Kindergeburtstag", "Spiele"], ["Maibaum", "Dorf"]
    ]
  },
  {
    id: "fantasie", name: "Figuren & Fantasie", emoji: "🧙",
    words: [
      ["Weihnachtsmann", "Rot"], ["Osterhase", "Frühling"], ["Vampir", "Nacht"], ["Hexe", "Märchen"],
      ["Drache", "Gefährlich"], ["Einhorn", "Glitzer"], ["Meerjungfrau", "Wasser"], ["Zombie", "Langsam"],
      ["Geist", "Unsichtbar"], ["Ritter", "Pferd"], ["Prinzessin", "Märchen"], ["Zwerg", "Bergwerk"],
      ["Roboter", "Zukunft"], ["Alien", "Weltall"], ["Superheld", "Kräfte"], ["Ninja", "Lautlos"],
      ["Zahnfee", "Kindheit"], ["Riese", "Groß"], ["Mumie", "Alt"], ["Engel", "Weiß"],
      ["Teufel", "Rot"], ["Werwolf", "Nacht"], ["Fee", "Klein"], ["Troll", "Hässlich"],
      ["Kobold", "Schabernack"], ["Elfe", "Wald"], ["Frankenstein", "Blitz"], ["Rotkäppchen", "Wald"],
      ["Aschenputtel", "Mitternacht"], ["Schneewittchen", "Sieben"], ["Dornröschen", "Schlafen"], ["Hänsel und Gretel", "Wald"],
      ["Pinocchio", "Holz"], ["Peter Pan", "Fliegen"], ["Sandmann", "Abend"], ["Yeti", "Schnee"],
      ["Sphinx", "Wüste"], ["Phönix", "Feuer"], ["Zentaur", "Pfeil und Bogen"], ["Pegasus", "Fliegen"],
      ["Golem", "Stein"], ["Zauberer Merlin", "Bart"], ["Rapunzel", "Haare"], ["Froschkönig", "Brunnen"],
      ["Rumpelstilzchen", "Gold"], ["Gestiefelter Kater", "Märchen"], ["Loch Ness", "See"], ["Cyborg", "Zukunft"]
    ]
  },
  {
    id: "natur", name: "Natur & Wetter", emoji: "🌦️",
    words: [
      ["Regenbogen", "Bunt"], ["Gewitter", "Laut"], ["Schnee", "Weiß"], ["Sonne", "Warm"],
      ["Mond", "Nacht"], ["Stern", "Himmel"], ["Wolke", "Grau"], ["Nebel", "Herbst"],
      ["Sturm", "Wind"], ["Tornado", "Amerika"], ["Hagel", "Sommer"], ["Erdbeben", "Wackeln"],
      ["Vulkan", "Insel"], ["Wasserfall", "Klippe"], ["Fluss", "Brücke"], ["See", "Baden"],
      ["Meer", "Blau"], ["Baum", "Holz"], ["Rose", "Rot"], ["Sonnenblume", "Groß"],
      ["Kaktus", "Pflanze"], ["Gras", "Grün"], ["Moos", "Wald"], ["Laub", "Herbst"],
      ["Tannenzapfen", "Wald"], ["Eichel", "Herbst"], ["Gänseblümchen", "Klein"], ["Löwenzahn", "Gelb"],
      ["Kleeblatt", "Glück"], ["Diamant", "Teuer"], ["Lagerfeuer", "Abend"], ["Eiszapfen", "Kalt"],
      ["Schneemann", "Kinder"], ["Gletscher", "Berge"], ["Polarlicht", "Norden"], ["Sonnenuntergang", "Romantik"],
      ["Hitzewelle", "Sommer"], ["Frühling", "Vögel"], ["Dschungel", "Feucht"], ["Savanne", "Tiere"],
      ["Sumpf", "Stiefel"], ["Mars", "Weltall"], ["Komet", "Schnell"], ["Sternschnuppe", "Nacht"],
      ["Ebbe", "Meer"], ["Tau", "Gras"], ["Pfütze", "Nass"], ["Muschel", "Strand"],
      ["Bernstein", "Gelb"], ["Sonnenfinsternis", "Selten"], ["Klimawandel", "Politik"], ["Tsunami", "Welle"]
    ]
  },
  {
    id: "verkehr", name: "Fahrzeuge & Verkehr", emoji: "🚗",
    words: [
      ["Auto", "Straße"], ["Fahrrad", "Klingel"], ["Motorrad", "Laut"], ["Bus", "Schule"],
      ["Zug", "Reise"], ["Flugzeug", "Urlaub"], ["Schiff", "Meer"], ["U-Boot", "Tief"],
      ["Hubschrauber", "Laut"], ["Rakete", "Schnell"], ["Taxi", "Nachts"], ["Straßenbahn", "Stadt"],
      ["Lastwagen", "Autobahn"], ["Krankenwagen", "Notfall"], ["Feuerwehrauto", "Rot"], ["Kinderwagen", "Baby"],
      ["Tretroller", "Kinder"], ["Inliner", "Rollen"], ["Segelboot", "Wind"], ["Heißluftballon", "Langsam"],
      ["Seilbahn", "Berg"], ["Zeppelin", "Langsam"], ["Ampel", "Warten"], ["Zebrastreifen", "Straße"],
      ["Kreisverkehr", "Rund"], ["Blitzer", "Foto"], ["Führerschein", "Prüfung"], ["Navi", "Stimme"],
      ["Wohnmobil", "Urlaub"], ["Cabrio", "Sommer"], ["Tretboot", "See"], ["Kutsche", "Hochzeit"],
      ["Fähre", "Insel"], ["Jetski", "Laut"], ["E-Scooter", "Stadt"], ["Tandem", "Fahrrad"],
      ["Traktor", "Langsam"], ["Gondel", "Wasser"], ["Bagger", "Baustelle"], ["Müllauto", "Morgens"],
      ["Panzer", "Militär"], ["Rennwagen", "Schnell"], ["Schlitten", "Schnee"], ["Parkplatz", "Suchen"],
      ["Tunnel", "Dunkel"], ["Brücke", "Fluss"], ["Tankanzeige", "Auto"], ["Abschleppwagen", "Haken"]
    ]
  },
  {
    id: "kleidung", name: "Kleidung & Mode", emoji: "👗",
    words: [
      ["Jeans", "Hose"], ["Krawatte", "Büro"], ["Socken", "Paar"], ["Turnschuhe", "Bequem"],
      ["Gummistiefel", "Regen"], ["Hut", "Kopf"], ["Mütze", "Winter"], ["Schal", "Kalt"],
      ["Handschuh", "Winter"], ["Bikini", "Sommer"], ["Badehose", "Nass"], ["Schlafanzug", "Bequem"],
      ["Kleid", "Party"], ["Anzug", "Hochzeit"], ["Hemd", "Bügeln"], ["T-Shirt", "Sommer"],
      ["Pullover", "Warm"], ["Hoodie", "Gemütlich"], ["Jacke", "Draußen"], ["Gürtel", "Hose"],
      ["Unterhose", "Drunter"], ["BH", "Drunter"], ["Strumpfhose", "Beine"], ["Sandalen", "Sommer"],
      ["Flip-Flops", "Strand"], ["Lederhose", "Bayern"], ["Brautkleid", "Weiß"], ["Schürze", "Kochen"],
      ["Ohrringe", "Glitzer"], ["Halskette", "Geschenk"], ["Handtasche", "Tragen"], ["Perücke", "Verkleidung"],
      ["Bademantel", "Hotel"], ["Basecap", "Kopf"], ["Fliege", "Elegant"], ["Weste", "Drüber"],
      ["Overall", "Arbeit"], ["Trikot", "Fan"], ["Stöckelschuhe", "Hoch"], ["Regenmantel", "Gelb"],
      ["Sonnenhut", "Sommer"], ["Rock", "Kurz"], ["Uniform", "Pflicht"], ["Taucheranzug", "Schwarz"],
      ["Karnevalskostüm", "Lustig"], ["Pantoffeln", "Zuhause"], ["Ohrenschützer", "Winter"], ["Manschettenknöpfe", "Elegant"]
    ]
  },
  {
    id: "laender", name: "Länder & Städte", emoji: "🌍",
    words: [
      ["Paris", "Liebe"], ["Rom", "Antik"], ["London", "Regen"], ["New York", "Hochhäuser"],
      ["Berlin", "Hauptstadt"], ["München", "Fußball"], ["Hamburg", "Wasser"], ["Köln", "Karneval"],
      ["Venedig", "Wasser"], ["Ägypten", "Wüste"], ["Japan", "Technik"], ["China", "Groß"],
      ["Indien", "Bunt"], ["Mexiko", "Scharf"], ["Brasilien", "Fußball"], ["Australien", "Weit weg"],
      ["Kanada", "Kalt"], ["USA", "Groß"], ["Russland", "Winter"], ["Schweiz", "Schokolade"],
      ["Österreich", "Berge"], ["Niederlande", "Fahrrad"], ["Spanien", "Sonne"], ["Griechenland", "Insel"],
      ["Türkei", "Urlaub"], ["Schweden", "Möbel"], ["Norwegen", "Berge"], ["Irland", "Regen"],
      ["Schottland", "Whisky"], ["Frankreich", "Wein"], ["Hawaii", "Insel"], ["Las Vegas", "Wüste"],
      ["Hollywood", "Sonne"], ["Dubai", "Reich"], ["Amsterdam", "Fahrrad"], ["Prag", "Bier"],
      ["Barcelona", "Fußball"], ["Mallorca", "Party"], ["Sylt", "Reich"], ["Bodensee", "Schiff"],
      ["Rügen", "Ostsee"], ["Kuba", "Oldtimer"], ["Thailand", "Strand"], ["Jamaika", "Insel"],
      ["Island", "Kalt"], ["Argentinien", "Fleisch"], ["Grönland", "Eis"], ["Neuseeland", "Schafe"],
      ["Dresden", "Osten"], ["Italien", "Urlaub"], ["Portugal", "Atlantik"], ["Polen", "Nachbar"],
      ["Kroatien", "Küste"], ["Finnland", "Sauna"], ["Peru", "Berge"], ["Südafrika", "Safari"]
    ]
  },
  {
    id: "technik", name: "Technik & Medien", emoji: "📱",
    words: [
      ["Handy", "Tasche"], ["Laptop", "Arbeit"], ["Kopfhörer", "Ohren"], ["Fernseher", "Abend"],
      ["WLAN", "Passwort"], ["WhatsApp", "Gruppe"], ["Instagram", "Fotos"], ["YouTube", "Videos"],
      ["Netflix", "Abo"], ["TikTok", "Jugend"], ["Google", "Fragen"], ["Selfie", "Lächeln"],
      ["Emoji", "Gefühl"], ["Drucker", "Büro"], ["Bildschirm", "Hell"], ["Ladekabel", "Vergessen"],
      ["Powerbank", "Reise"], ["Spielkonsole", "Wohnzimmer"], ["Drohne", "Luft"], ["VR-Brille", "Kopf"],
      ["Künstliche Intelligenz", "Zukunft"], ["Passwort", "Vergessen"], ["Computervirus", "Gefahr"], ["E-Mail", "Arbeit"],
      ["Podcast", "Gespräch"], ["Radio", "Auto"], ["Zeitung", "Morgen"], ["Bluetooth", "Verbinden"],
      ["Taschenrechner", "Schule"], ["Lautsprecher", "Party"], ["Smartwatch", "Schritte"], ["Webcam", "Laptop"],
      ["Hashtag", "Trend"], ["Like", "Gefallen"], ["Spam", "Nervig"], ["Update", "Warten"],
      ["Satellit", "Weltall"], ["Glühbirne", "Idee"], ["Quizshow", "Fernsehen"], ["Zeichentrickfilm", "Kinder"],
      ["Werbung", "Nervig"], ["Sprachnachricht", "Lang"], ["Akkuschrauber", "Werkzeug"], ["Smart Home", "Zukunft"],
      ["Livestream", "Echtzeit"], ["Online-Shopping", "Paket"], ["USB-Stick", "Klein"], ["Wikipedia", "Wissen"]
    ]
  },
  {
    id: "koerper", name: "Körper & Gesundheit", emoji: "🫀",
    words: [
      ["Herz", "Liebe"], ["Gehirn", "Kopf"], ["Nase", "Gesicht"], ["Ohr", "Kopf"],
      ["Auge", "Farbe"], ["Zahnspange", "Teenager"], ["Hand", "Fünf"], ["Knie", "Beugen"],
      ["Bauchnabel", "Fussel"], ["Glatze", "Alter"], ["Bart", "Mann"], ["Muskel", "Stark"],
      ["Skelett", "Halloween"], ["Blutspende", "Helfen"], ["Lunge", "Luft"], ["Magen", "Hunger"],
      ["Niesen", "Nase"], ["Schluckauf", "Nervig"], ["Gähnen", "Ansteckend"], ["Schnarchen", "Nacht"],
      ["Husten", "Winter"], ["Fieber", "Krank"], ["Kopfschmerzen", "Krank"], ["Gips", "Unfall"],
      ["Pflaster", "Kinder"], ["Impfung", "Arzt"], ["Sonnenbrand", "Strand"], ["Muskelkater", "Sport"],
      ["Allergie", "Frühling"], ["Kontaktlinsen", "Morgens"], ["Krücken", "Unfall"], ["Massage", "Rücken"],
      ["Tattoo", "Für immer"], ["Piercing", "Schmerz"], ["Sommersprossen", "Sonne"], ["Gänsehaut", "Kalt"],
      ["Lachen", "Freude"], ["Weinen", "Traurig"], ["Kitzeln", "Lachen"], ["Diät", "Abnehmen"],
      ["Schwitzen", "Hitze"], ["Zunge", "Mund"], ["Fingerabdruck", "Einzigartig"], ["Haarschnitt", "Friseur"],
      ["Ellenbogen", "Arm"], ["Röntgen", "Krankenhaus"], ["Narkose", "Operation"], ["Kater", "Morgen danach"]
    ]
  }
];
