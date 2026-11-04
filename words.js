// Wortliste: [Wort, Tipp für die Imposter]
// WICHTIG: Reihenfolge nicht verändern, nur am Ende einer Kategorie ergänzen –
// sonst bekommen Geräte mit unterschiedlichen Versionen verschiedene Wörter.
const CATEGORIES = [
  {
    id: "essen", name: "Essen & Trinken", emoji: "🍕",
    words: [
      ["Pizza", "Italien"], ["Sushi", "Japan"], ["Döner", "Imbiss"], ["Spaghetti", "Gabel"],
      ["Schokolade", "Kakao"], ["Kaffee", "Morgen"], ["Bier", "Hopfen"], ["Wein", "Traube"],
      ["Pommes", "Kartoffel"], ["Burger", "Brötchen"], ["Eis", "Sommer"], ["Popcorn", "Kino"],
      ["Brezel", "Bayern"], ["Honig", "Biene"], ["Käse", "Maus"], ["Suppe", "Löffel"],
      ["Salat", "Gesund"], ["Pfannkuchen", "Frühstück"], ["Banane", "Affe"], ["Erdbeere", "Rot"],
      ["Zitrone", "Sauer"], ["Knoblauch", "Vampir"], ["Croissant", "Frankreich"], ["Tee", "Beutel"],
      ["Champagner", "Silvester"], ["Wassermelone", "Kerne"], ["Currywurst", "Berlin"], ["Lebkuchen", "Weihnachtsmarkt"]
    ]
  },
  {
    id: "tiere", name: "Tiere", emoji: "🦁",
    words: [
      ["Löwe", "Mähne"], ["Elefant", "Rüssel"], ["Pinguin", "Eis"], ["Giraffe", "Hals"],
      ["Hai", "Flosse"], ["Katze", "Schnurren"], ["Hund", "Gassi"], ["Pferd", "Reiten"],
      ["Kuh", "Milch"], ["Schwein", "Bauernhof"], ["Adler", "Flügel"], ["Eule", "Nacht"],
      ["Schlange", "Gift"], ["Krokodil", "Fluss"], ["Känguru", "Australien"], ["Delfin", "Intelligent"],
      ["Spinne", "Netz"], ["Schmetterling", "Raupe"], ["Biene", "Stachel"], ["Frosch", "Teich"],
      ["Igel", "Stacheln"], ["Eichhörnchen", "Nuss"], ["Papagei", "Sprechen"], ["Kamel", "Wüste"],
      ["Wal", "Ozean"], ["Fuchs", "Schlau"], ["Panda", "Bambus"], ["Schnecke", "Langsam"]
    ]
  },
  {
    id: "orte", name: "Orte", emoji: "🏖️",
    words: [
      ["Strand", "Sand"], ["Krankenhaus", "Arzt"], ["Flughafen", "Koffer"], ["Schule", "Pause"],
      ["Kino", "Leinwand"], ["Supermarkt", "Kasse"], ["Bahnhof", "Gleis"], ["Zoo", "Käfig"],
      ["Bibliothek", "Leise"], ["Fitnessstudio", "Schweiß"], ["Kirche", "Glocke"], ["Friedhof", "Grab"],
      ["Restaurant", "Kellner"], ["Schwimmbad", "Chlor"], ["Gefängnis", "Gitter"], ["Museum", "Ausstellung"],
      ["Freizeitpark", "Achterbahn"], ["Bäckerei", "Morgens"], ["Zahnarzt", "Bohrer"], ["Bauernhof", "Traktor"],
      ["Wald", "Bäume"], ["Berg", "Gipfel"], ["Insel", "Wasser"], ["Wüste", "Hitze"],
      ["Club", "Türsteher"], ["Campingplatz", "Zelt"], ["Tankstelle", "Benzin"], ["Hotel", "Rezeption"]
    ]
  },
  {
    id: "berufe", name: "Berufe", emoji: "👩‍🚒",
    words: [
      ["Feuerwehrmann", "Schlauch"], ["Polizist", "Uniform"], ["Arzt", "Kittel"], ["Lehrer", "Tafel"],
      ["Koch", "Küche"], ["Pilot", "Cockpit"], ["Bäcker", "Mehl"], ["Friseur", "Schere"],
      ["Astronaut", "Weltall"], ["Richter", "Hammer"], ["Zauberer", "Hut"], ["Clown", "Zirkus"],
      ["Gärtner", "Pflanzen"], ["Fotograf", "Kamera"], ["Mechaniker", "Werkstatt"], ["Postbote", "Briefe"],
      ["Tierarzt", "Haustier"], ["Pirat", "Schatz"], ["Detektiv", "Lupe"], ["Bauarbeiter", "Helm"],
      ["Sänger", "Mikrofon"], ["Schauspieler", "Bühne"], ["Kapitän", "Schiff"], ["Programmierer", "Computer"]
    ]
  },
  {
    id: "dinge", name: "Gegenstände", emoji: "🔦",
    words: [
      ["Regenschirm", "Nass"], ["Handy", "Akku"], ["Schlüssel", "Tür"], ["Brille", "Augen"],
      ["Zahnbürste", "Bad"], ["Kerze", "Flamme"], ["Uhr", "Zeit"], ["Spiegel", "Spiegelbild"],
      ["Kissen", "Bett"], ["Fernseher", "Fernbedienung"], ["Gitarre", "Saiten"], ["Fahrrad", "Pedal"],
      ["Rucksack", "Tragen"], ["Kühlschrank", "Kalt"], ["Staubsauger", "Putzen"], ["Hammer", "Nagel"],
      ["Luftballon", "Geburtstag"], ["Taschenlampe", "Dunkel"], ["Teppich", "Boden"], ["Koffer", "Reise"],
      ["Schere", "Schneiden"], ["Kamm", "Haare"], ["Wecker", "Aufstehen"], ["Leiter", "Hoch"],
      ["Sonnenbrille", "Sonne"], ["Kopfhörer", "Musik"], ["Würfel", "Spiel"], ["Krone", "König"]
    ]
  },
  {
    id: "freizeit", name: "Sport & Freizeit", emoji: "⚽",
    words: [
      ["Fußball", "Tor"], ["Tennis", "Schläger"], ["Skifahren", "Schnee"], ["Schwimmen", "Bahn"],
      ["Basketball", "Korb"], ["Golf", "Loch"], ["Boxen", "Handschuhe"], ["Yoga", "Matte"],
      ["Bowling", "Kegel"], ["Schach", "König"], ["Karaoke", "Singen"], ["Angeln", "Haken"],
      ["Surfen", "Welle"], ["Klettern", "Seil"], ["Tanzen", "Rhythmus"], ["Grillen", "Kohle"],
      ["Wandern", "Schuhe"], ["Joggen", "Laufen"], ["Darts", "Pfeil"], ["Poker", "Karten"],
      ["Zelten", "Schlafsack"], ["Gaming", "Controller"], ["Malen", "Pinsel"], ["Reiten", "Sattel"]
    ]
  },
  {
    id: "feste", name: "Feste & Ereignisse", emoji: "🎉",
    words: [
      ["Weihnachten", "Geschenke"], ["Ostern", "Eier"], ["Halloween", "Kostüm"], ["Silvester", "Feuerwerk"],
      ["Hochzeit", "Ring"], ["Geburtstag", "Kuchen"], ["Karneval", "Verkleiden"], ["Oktoberfest", "Dirndl"],
      ["Beerdigung", "Schwarz"], ["Abschlussball", "Anzug"], ["Junggesellenabschied", "Party"], ["Valentinstag", "Rosen"],
      ["Festival", "Bühne"], ["Taufe", "Baby"], ["Umzug", "Kartons"], ["Urlaub", "Erholung"]
    ]
  },
  {
    id: "promis", name: "Figuren & Fantasie", emoji: "🧙",
    words: [
      ["Weihnachtsmann", "Rentier"], ["Osterhase", "Korb"], ["Vampir", "Blut"], ["Hexe", "Besen"],
      ["Drache", "Feuer"], ["Einhorn", "Regenbogen"], ["Meerjungfrau", "Schwanz"], ["Zombie", "Untot"],
      ["Geist", "Gruselig"], ["Ritter", "Rüstung"], ["Prinzessin", "Schloss"], ["Zwerg", "Klein"],
      ["Roboter", "Metall"], ["Alien", "Ufo"], ["Superheld", "Umhang"], ["Ninja", "Schwarz"],
      ["Zahnfee", "Zahn"], ["Riese", "Groß"], ["Mumie", "Ägypten"], ["Engel", "Flügel"]
    ]
  }
];
