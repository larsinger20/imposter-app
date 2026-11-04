// Wortliste: [Wort, Tipp für die Imposter]
// Der Tipp passt zum Wort, verrät es aber nicht direkt.
// WICHTIG: Neue Wörter nur am ENDE einer Kategorie anhängen und neue Kategorien nur am ENDE der Liste –
// sonst bekommen Handys mit alter und neuer Version unterschiedliche Wörter für denselben Code.
const CATEGORIES = [
  {
    id: "essen", name: "Essen & Trinken", emoji: "🍕",
    words: [
      ["Pizza", "Italien"], ["Sushi", "Reis"], ["Döner", "Spieß"], ["Spaghetti", "Tomatensoße"],
      ["Schokolade", "Kakao"], ["Kaffee", "Bohne"], ["Bier", "Hopfen"], ["Wein", "Traube"],
      ["Pommes", "Frittieren"], ["Burger", "Fast Food"], ["Eis", "Waffel"], ["Popcorn", "Mais"],
      ["Brezel", "Salz"], ["Honig", "Biene"], ["Käse", "Loch"], ["Suppe", "Löffel"],
      ["Salat", "Dressing"], ["Pfannkuchen", "Flach"], ["Banane", "Gelb"], ["Erdbeere", "Marmelade"],
      ["Zitrone", "Sauer"], ["Knoblauch", "Vampir"], ["Croissant", "Butter"], ["Tee", "Teekanne"],
      ["Champagner", "Anstoßen"], ["Wassermelone", "Kerne"], ["Currywurst", "Ketchup"], ["Lebkuchen", "Herz"],
      ["Spiegelei", "Pfanne"], ["Müsli", "Frühstück"], ["Lasagne", "Schichten"], ["Gulasch", "Ungarn"],
      ["Schnitzel", "Panade"], ["Bratwurst", "Grill"], ["Sauerkraut", "Kohl"], ["Apfelstrudel", "Österreich"],
      ["Tiramisu", "Mascarpone"], ["Cola", "Kohlensäure"], ["Orangensaft", "Vitamine"], ["Avocado", "Guacamole"],
      ["Toast", "Scheibe"], ["Nutella", "Haselnuss"], ["Senf", "Würstchen"], ["Gurke", "Einlegen"],
      ["Karotte", "Hase"], ["Zwiebel", "Weinen"], ["Pilz", "Sammeln"], ["Kürbis", "Halloween"],
      ["Ananas", "Hawaii"], ["Kokosnuss", "Palme"], ["Kirsche", "Stiel"], ["Donut", "Glasur"],
      ["Waffel", "Puderzucker"], ["Gummibärchen", "Bunt"], ["Cocktail", "Schirmchen"], ["Glühwein", "Zimt"],
      ["Milch", "Kuh"], ["Ei", "Huhn"], ["Raclette", "Pfännchen"], ["Fondue", "Schweiz"],
      ["Taco", "Mexiko"], ["Pudding", "Wackeln"], ["Torte", "Kerzen"], ["Zuckerwatte", "Jahrmarkt"],
      ["Kaugummi", "Kauen"], ["Lakritz", "Schwarz"], ["Apfel", "Baum"], ["Kartoffelsalat", "Mayonnaise"],
      ["Frikadelle", "Hackfleisch"], ["Maultaschen", "Schwaben"], ["Weißwurst", "Bayern"], ["Hummus", "Kichererbse"]
    ]
  },
  {
    id: "tiere", name: "Tiere", emoji: "🦁",
    words: [
      ["Löwe", "Mähne"], ["Elefant", "Rüssel"], ["Pinguin", "Antarktis"], ["Giraffe", "Hals"],
      ["Hai", "Flosse"], ["Katze", "Schnurren"], ["Hund", "Bellen"], ["Pferd", "Hufeisen"],
      ["Kuh", "Glocke"], ["Schwein", "Schlamm"], ["Adler", "Wappen"], ["Eule", "Nacht"],
      ["Schlange", "Zischen"], ["Krokodil", "Zähne"], ["Känguru", "Beutel"], ["Delfin", "Springen"],
      ["Spinne", "Netz"], ["Schmetterling", "Raupe"], ["Biene", "Stachel"], ["Frosch", "Quaken"],
      ["Igel", "Stacheln"], ["Eichhörnchen", "Nuss"], ["Papagei", "Nachsprechen"], ["Kamel", "Höcker"],
      ["Wal", "Ozean"], ["Fuchs", "Schlau"], ["Panda", "Bambus"], ["Schnecke", "Haus"],
      ["Affe", "Klettern"], ["Bär", "Winterschlaf"], ["Wolf", "Heulen"], ["Hase", "Möhre"],
      ["Maus", "Falle"], ["Ratte", "Kanalisation"], ["Huhn", "Gackern"], ["Ente", "Teich"],
      ["Gans", "Martinstag"], ["Schaf", "Blöken"], ["Ziege", "Meckern"], ["Esel", "Stur"],
      ["Zebra", "Streifen"], ["Tiger", "Raubkatze"], ["Leopard", "Flecken"], ["Nashorn", "Horn"],
      ["Nilpferd", "Afrika"], ["Gorilla", "Brust"], ["Koala", "Eukalyptus"], ["Faultier", "Langsam"],
      ["Krake", "Tentakel"], ["Qualle", "Durchsichtig"], ["Seestern", "Arme"], ["Krabbe", "Schere"],
      ["Hummer", "Delikatesse"], ["Goldfisch", "Aquarium"], ["Schildkröte", "Panzer"], ["Fledermaus", "Kopfüber"],
      ["Marienkäfer", "Punkte"], ["Ameise", "Haufen"], ["Mücke", "Stich"], ["Storch", "Baby"],
      ["Flamingo", "Rosa"], ["Pfau", "Federn"], ["Specht", "Klopfen"], ["Hamster", "Laufrad"],
      ["Dinosaurier", "Ausgestorben"], ["Hirsch", "Geweih"], ["Maulwurf", "Hügel"], ["Biber", "Damm"],
      ["Robbe", "Heuler"], ["Eisbär", "Arktis"], ["Wildschwein", "Hauer"], ["Kolibri", "Winzig"]
    ]
  },
  {
    id: "orte", name: "Orte", emoji: "🏖️",
    words: [
      ["Strand", "Sand"], ["Krankenhaus", "Notaufnahme"], ["Flughafen", "Gate"], ["Schule", "Klassenzimmer"],
      ["Kino", "Leinwand"], ["Supermarkt", "Einkaufswagen"], ["Bahnhof", "Gleis"], ["Zoo", "Gehege"],
      ["Bibliothek", "Leise"], ["Fitnessstudio", "Hanteln"], ["Kirche", "Glocken"], ["Friedhof", "Grab"],
      ["Restaurant", "Speisekarte"], ["Schwimmbad", "Sprungturm"], ["Gefängnis", "Zelle"], ["Museum", "Ausstellung"],
      ["Freizeitpark", "Achterbahn"], ["Bäckerei", "Brötchen"], ["Bauernhof", "Traktor"], ["Wald", "Bäume"],
      ["Berg", "Gipfel"], ["Insel", "Gestrandet"], ["Wüste", "Düne"], ["Club", "Türsteher"],
      ["Campingplatz", "Wohnwagen"], ["Tankstelle", "Zapfsäule"], ["Hotel", "Rezeption"], ["Spielplatz", "Rutsche"],
      ["Bank", "Tresor"], ["Post", "Paket"], ["Rathaus", "Bürgermeister"], ["Kindergarten", "Basteln"],
      ["Universität", "Hörsaal"], ["Stadion", "Fans"], ["Theater", "Vorhang"], ["Casino", "Roulette"],
      ["Zirkus", "Manege"], ["Jahrmarkt", "Riesenrad"], ["Weihnachtsmarkt", "Buden"], ["Baumarkt", "Werkzeug"],
      ["Apotheke", "Medikamente"], ["Sauna", "Aufguss"], ["Leuchtturm", "Küste"], ["Burg", "Mittelalter"],
      ["Schloss", "Neuschwanstein"], ["Höhle", "Dunkel"], ["Hafen", "Container"], ["Autobahn", "Stau"],
      ["Kneipe", "Stammtisch"], ["Waschsalon", "Trommel"], ["Bushaltestelle", "Fahrplan"], ["Kaufhaus", "Rolltreppe"],
      ["Polizeiwache", "Verhör"], ["Feuerwache", "Rutschstange"], ["Gewächshaus", "Pflanzen"], ["Kreuzfahrtschiff", "Buffet"],
      ["Eisdiele", "Kugel"], ["Tiefgarage", "Parkticket"], ["Wartezimmer", "Zeitschriften"], ["Dachboden", "Gerümpel"],
      ["Keller", "Treppe runter"], ["Solarium", "Bräunen"], ["Golfplatz", "Grün"], ["Raumstation", "Schwerelos"]
    ]
  },
  {
    id: "berufe", name: "Berufe", emoji: "👩‍🚒",
    words: [
      ["Feuerwehrmann", "Löschen"], ["Polizist", "Dienstmarke"], ["Arzt", "Stethoskop"], ["Lehrer", "Noten"],
      ["Koch", "Herd"], ["Pilot", "Cockpit"], ["Bäcker", "Mehl"], ["Friseur", "Föhn"],
      ["Astronaut", "Weltall"], ["Richter", "Urteil"], ["Zauberer", "Kaninchen"], ["Clown", "Rote Nase"],
      ["Gärtner", "Rasen"], ["Fotograf", "Kamera"], ["Mechaniker", "Werkstatt"], ["Postbote", "Briefkasten"],
      ["Tierarzt", "Haustiere"], ["Pirat", "Augenklappe"], ["Detektiv", "Lupe"], ["Bauarbeiter", "Helm"],
      ["Sänger", "Mikrofon"], ["Schauspieler", "Rolle"], ["Kapitän", "Steuerrad"], ["Programmierer", "Code"],
      ["Krankenpfleger", "Nachtschicht"], ["Metzger", "Fleisch"], ["Taxifahrer", "Fahrgast"], ["Busfahrer", "Linie"],
      ["Elektriker", "Kabel"], ["Klempner", "Rohr"], ["Maler", "Farbe"], ["Tischler", "Holz"],
      ["Bauer", "Feld"], ["Fischer", "Kutter"], ["Anwalt", "Gericht"], ["Journalist", "Zeitung"],
      ["Kellner", "Trinkgeld"], ["Bankberater", "Kredit"], ["Soldat", "Kaserne"], ["Model", "Laufsteg"],
      ["Influencer", "Follower"], ["Bibliothekar", "Ausleihen"], ["Zahnarzt", "Karies"], ["Hebamme", "Geburt"],
      ["Bestatter", "Sarg"], ["Schornsteinfeger", "Kamin"], ["Archäologe", "Ausgrabung"], ["Wissenschaftler", "Labor"],
      ["Architekt", "Bauplan"], ["DJ", "Plattenteller"], ["Balletttänzer", "Spitzenschuhe"], ["Schiedsrichter", "Rote Karte"],
      ["Flugbegleiter", "Sicherheitshinweise"], ["Kassierer", "Kasse"], ["Hausmeister", "Schlüsselbund"], ["Müllmann", "Tonne"],
      ["Dachdecker", "Ziegel"], ["Förster", "Hochsitz"], ["Imker", "Bienenstock"], ["Winzer", "Fass"],
      ["Politiker", "Partei"], ["Butler", "Villa"], ["Psychologe", "Couch"], ["Spion", "Geheimagent"]
    ]
  },
  {
    id: "dinge", name: "Gegenstände", emoji: "🔦",
    words: [
      ["Regenschirm", "Regen"], ["Schlüssel", "Tür"], ["Brille", "Gläser"], ["Zahnbürste", "Zahnpasta"],
      ["Kerze", "Wachs"], ["Uhr", "Zeiger"], ["Spiegel", "Spiegelbild"], ["Kissen", "Weich"],
      ["Gitarre", "Saiten"], ["Kühlschrank", "Kalt"], ["Staubsauger", "Staub"], ["Hammer", "Nagel"],
      ["Luftballon", "Aufblasen"], ["Taschenlampe", "Batterie"], ["Teppich", "Boden"], ["Koffer", "Packen"],
      ["Schere", "Papier"], ["Kamm", "Haare"], ["Wecker", "Klingeln"], ["Leiter", "Sprossen"],
      ["Sonnenbrille", "Sommer"], ["Würfel", "Augenzahl"], ["Krone", "König"], ["Klavier", "Tasten"],
      ["Schlagzeug", "Sticks"], ["Geige", "Bogen"], ["Trompete", "Blasen"], ["Bett", "Matratze"],
      ["Sofa", "Wohnzimmer"], ["Lampe", "Licht"], ["Stuhl", "Sitzen"], ["Gabel", "Besteck"],
      ["Messer", "Scharf"], ["Kochtopf", "Deckel"], ["Mikrowelle", "Aufwärmen"], ["Waschmaschine", "Schleudern"],
      ["Bügeleisen", "Falten"], ["Handtuch", "Abtrocknen"], ["Seife", "Schaum"], ["Klopapier", "Rolle"],
      ["Kugelschreiber", "Mine"], ["Bleistift", "Spitzer"], ["Radiergummi", "Fehler"], ["Buch", "Seiten"],
      ["Kalender", "Termine"], ["Brief", "Umschlag"], ["Geldbeutel", "Münzen"], ["Feuerzeug", "Flamme"],
      ["Klebeband", "Kleben"], ["Teddybär", "Kuscheln"], ["Schnuller", "Saugen"], ["Besen", "Fegen"],
      ["Blumenvase", "Strauß"], ["Bilderrahmen", "Foto"], ["Sanduhr", "Rieseln"], ["Kompass", "Norden"],
      ["Fernglas", "Weit weg"], ["Anker", "Kette"], ["Mülleimer", "Abfall"], ["Gießkanne", "Blumen"],
      ["Wäscheklammer", "Leine"], ["Briefmarke", "Sammeln"], ["Schaukel", "Schwung"], ["Zahnstocher", "Holzstäbchen"],
      ["Kleiderbügel", "Schrank"], ["Fußmatte", "Willkommen"], ["Schneekugel", "Schütteln"], ["Kronleuchter", "Decke"]
    ]
  },
  {
    id: "freizeit", name: "Sport & Freizeit", emoji: "⚽",
    words: [
      ["Fußball", "Elfmeter"], ["Tennis", "Wimbledon"], ["Skifahren", "Piste"], ["Schwimmen", "Bahnen"],
      ["Basketball", "Korb"], ["Golf", "Abschlag"], ["Boxen", "Ring"], ["Yoga", "Matte"],
      ["Bowling", "Strike"], ["Schach", "Matt"], ["Karaoke", "Singen"], ["Angeln", "Köder"],
      ["Surfen", "Welle"], ["Klettern", "Seil"], ["Tanzen", "Rhythmus"], ["Grillen", "Kohle"],
      ["Wandern", "Pfad"], ["Joggen", "Ausdauer"], ["Darts", "Pfeil"], ["Poker", "Bluff"],
      ["Zelten", "Schlafsack"], ["Videospiele", "Controller"], ["Malen", "Staffelei"], ["Reiten", "Sattel"],
      ["Volleyball", "Baggern"], ["Handball", "Harz"], ["Eishockey", "Puck"], ["Eiskunstlauf", "Pirouette"],
      ["Snowboard", "Halfpipe"], ["Skateboard", "Kickflip"], ["Radrennen", "Tour de France"], ["Marathon", "42 Kilometer"],
      ["Formel 1", "Boxenstopp"], ["Rudern", "Achter"], ["Tauchen", "Sauerstoff"], ["Fallschirmspringen", "Freier Fall"],
      ["Bungee-Jumping", "Brücke"], ["Tischtennis", "Platte"], ["Badminton", "Federball"], ["Billard", "Queue"],
      ["Minigolf", "Hindernis"], ["Monopoly", "Schlossallee"], ["Memory", "Paare"], ["Puzzle", "Teile"],
      ["Kreuzworträtsel", "Kästchen"], ["Sudoku", "Zahlen"], ["Stricken", "Nadeln"], ["Kochen", "Rezept"],
      ["Segeln", "Wind"], ["Kanu", "Paddel"], ["Judo", "Wurf"], ["Fechten", "Degen"],
      ["Paintball", "Treffer"], ["Lasertag", "Weste"], ["Escape Room", "Rätsel"], ["Schnitzeljagd", "Hinweise"],
      ["Verstecken", "Zählen"], ["Schneeballschlacht", "Werfen"], ["Sandburg", "Eimer"], ["Trampolin", "Hüpfen"],
      ["Bierpong", "Becher"], ["Gewichtheben", "Hantel"], ["Wasserski", "Lift"], ["Kartenhaus", "Vorsichtig"]
    ]
  },
  {
    id: "feste", name: "Feste & Ereignisse", emoji: "🎉",
    words: [
      ["Weihnachten", "Tannenbaum"], ["Ostern", "Eiersuche"], ["Halloween", "Kostüm"], ["Silvester", "Feuerwerk"],
      ["Hochzeit", "Ring"], ["Geburtstag", "Geschenk"], ["Karneval", "Konfetti"], ["Oktoberfest", "Dirndl"],
      ["Beerdigung", "Trauer"], ["Abiball", "Zeugnis"], ["Junggesellenabschied", "Bräutigam"], ["Valentinstag", "Rosen"],
      ["Festival", "Bändchen"], ["Taufe", "Pate"], ["Umzug", "Kartons"], ["Urlaub", "Erholung"],
      ["Einschulung", "Schultüte"], ["Muttertag", "Blumenstrauß"], ["Nikolaus", "Stiefel"], ["Sankt Martin", "Laterne"],
      ["Erntedank", "Herbst"], ["Einweihungsparty", "Neue Wohnung"], ["Klassentreffen", "Ehemalige"], ["Familienfeier", "Verwandte"],
      ["Weltmeisterschaft", "Public Viewing"], ["Olympische Spiele", "Medaille"], ["Konzert", "Bühne"], ["Heiratsantrag", "Knie"],
      ["Babyparty", "Schwanger"], ["Führerscheinprüfung", "Fahrlehrer"], ["Vorstellungsgespräch", "Bewerbung"], ["Erstes Date", "Kribbeln"],
      ["Scheidung", "Trennung"], ["Ruhestand", "Rente"], ["Wahl", "Stimmzettel"], ["Flohmarkt", "Gebraucht"],
      ["Polterabend", "Porzellan"], ["Mondlandung", "Apollo"], ["Eurovision Song Contest", "Punkte"], ["Black Friday", "Rabatt"],
      ["Ramadan", "Fasten"], ["Adventskalender", "Türchen"], ["Schulabschluss", "Prüfung"], ["Pyjamaparty", "Übernachten"],
      ["Grillparty", "Garten"], ["Hochzeitstag", "Jahrestag"], ["Kindergeburtstag", "Topfschlagen"], ["Maibaum", "Erster Mai"]
    ]
  },
  {
    id: "fantasie", name: "Figuren & Fantasie", emoji: "🧙",
    words: [
      ["Weihnachtsmann", "Rentier"], ["Osterhase", "Korb"], ["Vampir", "Eckzähne"], ["Hexe", "Kessel"],
      ["Drache", "Feuer"], ["Einhorn", "Fabelwesen"], ["Meerjungfrau", "Muschel"], ["Zombie", "Untot"],
      ["Geist", "Spuk"], ["Ritter", "Rüstung"], ["Prinzessin", "Tiara"], ["Zwerg", "Zipfelmütze"],
      ["Roboter", "Metall"], ["Alien", "Ufo"], ["Superheld", "Umhang"], ["Ninja", "Japan"],
      ["Zahnfee", "Kopfkissen"], ["Riese", "Bohnenranke"], ["Mumie", "Bandagen"], ["Engel", "Heiligenschein"],
      ["Teufel", "Hölle"], ["Werwolf", "Vollmond"], ["Fee", "Zauberstab"], ["Troll", "Brücke"],
      ["Kobold", "Goldtopf"], ["Elfe", "Spitze Ohren"], ["Frankenstein", "Monster"], ["Rotkäppchen", "Großmutter"],
      ["Aschenputtel", "Schuh"], ["Schneewittchen", "Apfel"], ["Dornröschen", "Spindel"], ["Hänsel und Gretel", "Brotkrumen"],
      ["Pinocchio", "Lügen"], ["Peter Pan", "Nimmerland"], ["Sandmann", "Traum"], ["Yeti", "Himalaya"],
      ["Sphinx", "Löwenkörper"], ["Phönix", "Asche"], ["Zentaur", "Pferdekörper"], ["Pegasus", "Sternbild"],
      ["Golem", "Lehm"], ["Zauberer Merlin", "König Artus"], ["Rapunzel", "Turm"], ["Froschkönig", "Kuss"],
      ["Rumpelstilzchen", "Name"], ["Gestiefelter Kater", "Märchenkatze"], ["Loch Ness", "Schottland"], ["Cyborg", "Halb Mensch"]
    ]
  },
  {
    id: "natur", name: "Natur & Wetter", emoji: "🌦️",
    words: [
      ["Regenbogen", "Farben"], ["Gewitter", "Blitz"], ["Schnee", "Flocke"], ["Sonne", "Strahlen"],
      ["Mond", "Krater"], ["Stern", "Funkeln"], ["Wolke", "Himmel"], ["Nebel", "Sicht"],
      ["Sturm", "Orkan"], ["Tornado", "Wirbel"], ["Hagel", "Eiskörner"], ["Erdbeben", "Richterskala"],
      ["Vulkan", "Lava"], ["Wasserfall", "Rauschen"], ["Fluss", "Strömung"], ["See", "Ufer"],
      ["Meer", "Salzwasser"], ["Baum", "Rinde"], ["Rose", "Dornen"], ["Sonnenblume", "Van Gogh"],
      ["Kaktus", "Trocken"], ["Gras", "Mähen"], ["Moos", "Feucht"], ["Laub", "Rascheln"],
      ["Tannenzapfen", "Nadelbaum"], ["Eichel", "Eiche"], ["Gänseblümchen", "Wiese"], ["Löwenzahn", "Pusteblume"],
      ["Kleeblatt", "Vier"], ["Diamant", "Edelstein"], ["Lagerfeuer", "Stockbrot"], ["Eiszapfen", "Dachrinne"],
      ["Schneemann", "Rollen"], ["Gletscher", "Schmelzen"], ["Polarlicht", "Himmelsleuchten"], ["Sonnenuntergang", "Abendrot"],
      ["Hitzewelle", "Ventilator"], ["Frühling", "Blühen"], ["Dschungel", "Lianen"], ["Savanne", "Safari"],
      ["Sumpf", "Matsch"], ["Mars", "Roter Planet"], ["Komet", "Schweif"], ["Sternschnuppe", "Wunsch"],
      ["Ebbe", "Watt"], ["Tau", "Morgen"], ["Pfütze", "Springen"], ["Muschel", "Meeresrauschen"],
      ["Bernstein", "Ostsee"], ["Sonnenfinsternis", "Verdunkelung"], ["Klimawandel", "Erwärmung"], ["Tsunami", "Flutwelle"]
    ]
  },
  {
    id: "verkehr", name: "Fahrzeuge & Verkehr", emoji: "🚗",
    words: [
      ["Auto", "Motor"], ["Fahrrad", "Pedal"], ["Motorrad", "Lederjacke"], ["Bus", "Haltestelle"],
      ["Zug", "Schaffner"], ["Flugzeug", "Landung"], ["Schiff", "Deck"], ["U-Boot", "Periskop"],
      ["Hubschrauber", "Rotor"], ["Rakete", "Countdown"], ["Taxi", "Taxameter"], ["Straßenbahn", "Schienen"],
      ["Lastwagen", "Ladung"], ["Krankenwagen", "Blaulicht"], ["Feuerwehrauto", "Sirene"], ["Kinderwagen", "Schieben"],
      ["Tretroller", "Treten"], ["Inliner", "Knieschoner"], ["Segelboot", "Mast"], ["Heißluftballon", "Brenner"],
      ["Seilbahn", "Kabine"], ["Zeppelin", "Luftschiff"], ["Ampel", "Rot"], ["Zebrastreifen", "Fußgänger"],
      ["Kreisverkehr", "Ausfahrt"], ["Blitzer", "Geschwindigkeit"], ["Führerschein", "Fahrschule"], ["Navi", "Route"],
      ["Wohnmobil", "Campen"], ["Cabrio", "Verdeck"], ["Tretboot", "Schwan"], ["Kutsche", "Pferde"],
      ["Fähre", "Überfahrt"], ["Jetski", "Gischt"], ["E-Scooter", "Leihen"], ["Tandem", "Zu zweit"],
      ["Traktor", "Acker"], ["Gondel", "Venedig"], ["Bagger", "Schaufel"], ["Müllauto", "Abholung"],
      ["Panzer", "Ketten"], ["Rennwagen", "Startaufstellung"], ["Schlitten", "Rodeln"], ["Parkplatz", "Einparken"],
      ["Tunnel", "Durchfahrt"], ["Brücke", "Überqueren"], ["Tankanzeige", "Reserve"], ["Abschleppwagen", "Panne"]
    ]
  },
  {
    id: "kleidung", name: "Kleidung & Mode", emoji: "👗",
    words: [
      ["Jeans", "Blau"], ["Krawatte", "Knoten"], ["Socken", "Füße"], ["Turnschuhe", "Sport"],
      ["Gummistiefel", "Pfütze"], ["Hut", "Krempe"], ["Mütze", "Bommel"], ["Schal", "Wickeln"],
      ["Handschuh", "Finger"], ["Bikini", "Zweiteiler"], ["Badehose", "Baden"], ["Schlafanzug", "Schlafengehen"],
      ["Kleid", "Abend"], ["Anzug", "Sakko"], ["Hemd", "Knöpfe"], ["T-Shirt", "Aufdruck"],
      ["Pullover", "Wolle"], ["Hoodie", "Kapuze"], ["Jacke", "Reißverschluss"], ["Gürtel", "Schnalle"],
      ["Unterhose", "Gummiband"], ["BH", "Körbchen"], ["Strumpfhose", "Laufmasche"], ["Sandalen", "Riemen"],
      ["Flip-Flops", "Schlappen"], ["Lederhose", "Tracht"], ["Brautkleid", "Schleier"], ["Schürze", "Küche"],
      ["Ohrringe", "Schmuck"], ["Halskette", "Anhänger"], ["Handtasche", "Henkel"], ["Perücke", "Kunsthaar"],
      ["Bademantel", "Flauschig"], ["Basecap", "Baseball"], ["Fliege", "Smoking"], ["Weste", "Ärmellos"],
      ["Overall", "Einteiler"], ["Trikot", "Rückennummer"], ["Stöckelschuhe", "Absatz"], ["Regenmantel", "Wasserdicht"],
      ["Sonnenhut", "Schatten"], ["Rock", "Knielang"], ["Uniform", "Einheitlich"], ["Taucheranzug", "Neopren"],
      ["Karnevalskostüm", "Verkleidung"], ["Pantoffeln", "Hausschuhe"], ["Ohrenschützer", "Kälte"], ["Manschettenknöpfe", "Ärmel"]
    ]
  },
  {
    id: "laender", name: "Länder & Städte", emoji: "🌍",
    words: [
      ["Paris", "Eiffelturm"], ["Rom", "Kolosseum"], ["London", "Big Ben"], ["New York", "Freiheitsstatue"],
      ["Berlin", "Brandenburger Tor"], ["München", "Weißbier"], ["Hamburg", "Elbphilharmonie"], ["Köln", "Dom"],
      ["Venedig", "Kanäle"], ["Ägypten", "Pyramiden"], ["Japan", "Kirschblüte"], ["China", "Große Mauer"],
      ["Indien", "Curry"], ["Mexiko", "Sombrero"], ["Brasilien", "Samba"], ["Australien", "Outback"],
      ["Kanada", "Ahornblatt"], ["USA", "Sternenbanner"], ["Russland", "Matrjoschka"], ["Schweiz", "Neutral"],
      ["Österreich", "Alpen"], ["Niederlande", "Tulpen"], ["Spanien", "Flamenco"], ["Griechenland", "Akropolis"],
      ["Türkei", "Bosporus"], ["Schweden", "Elch"], ["Norwegen", "Fjord"], ["Irland", "Grüne Insel"],
      ["Schottland", "Dudelsack"], ["Frankreich", "Baguette"], ["Hawaii", "Hula"], ["Las Vegas", "Glücksspiel"],
      ["Hollywood", "Filmstars"], ["Dubai", "Wolkenkratzer"], ["Amsterdam", "Grachten"], ["Prag", "Moldau"],
      ["Barcelona", "Sagrada Família"], ["Mallorca", "Ballermann"], ["Sylt", "Nordsee"], ["Bodensee", "Dreiländereck"],
      ["Rügen", "Kreidefelsen"], ["Kuba", "Zigarre"], ["Thailand", "Tempel"], ["Jamaika", "Reggae"],
      ["Island", "Geysir"], ["Argentinien", "Tango"], ["Grönland", "Inuit"], ["Neuseeland", "Kiwi"],
      ["Dresden", "Frauenkirche"], ["Italien", "Stiefel"], ["Portugal", "Fado"], ["Polen", "Pierogi"],
      ["Kroatien", "Adria"], ["Finnland", "Tausend Seen"], ["Peru", "Machu Picchu"], ["Südafrika", "Kapstadt"]
    ]
  },
  {
    id: "technik", name: "Technik & Medien", emoji: "📱",
    words: [
      ["Handy", "Akku"], ["Laptop", "Tastatur"], ["Kopfhörer", "Musik hören"], ["Fernseher", "Fernbedienung"],
      ["WLAN", "Router"], ["WhatsApp", "Blaue Haken"], ["Instagram", "Filter"], ["YouTube", "Abonnieren"],
      ["Netflix", "Serie"], ["TikTok", "Kurzvideo"], ["Google", "Suchmaschine"], ["Selfie", "Frontkamera"],
      ["Emoji", "Smiley"], ["Drucker", "Papierstau"], ["Bildschirm", "Pixel"], ["Ladekabel", "Steckdose"],
      ["Powerbank", "Unterwegs"], ["Spielkonsole", "Zocken"], ["Drohne", "Propeller"], ["VR-Brille", "Virtuell"],
      ["Künstliche Intelligenz", "Chatbot"], ["Passwort", "Geheim"], ["Computervirus", "Hacker"], ["E-Mail", "Postfach"],
      ["Podcast", "Zuhören"], ["Radio", "Sender"], ["Zeitung", "Schlagzeile"], ["Bluetooth", "Kabellos"],
      ["Taschenrechner", "Mathe"], ["Lautsprecher", "Bass"], ["Smartwatch", "Handgelenk"], ["Webcam", "Videocall"],
      ["Hashtag", "Raute"], ["Like", "Daumen hoch"], ["Spam", "Unerwünscht"], ["Update", "Neustart"],
      ["Satellit", "Umlaufbahn"], ["Glühbirne", "Edison"], ["Quizshow", "Moderator"], ["Zeichentrickfilm", "Animation"],
      ["Werbung", "Unterbrechung"], ["Sprachnachricht", "Aufnehmen"], ["Akkuschrauber", "Bohren"], ["Smart Home", "Sprachassistent"],
      ["Livestream", "Live-Chat"], ["Online-Shopping", "Warenkorb"], ["USB-Stick", "Speichern"], ["Wikipedia", "Lexikon"]
    ]
  },
  {
    id: "koerper", name: "Körper & Gesundheit", emoji: "🫀",
    words: [
      ["Herz", "Schlag"], ["Gehirn", "Denken"], ["Nase", "Riechen"], ["Ohr", "Hören"],
      ["Auge", "Sehen"], ["Zahnspange", "Draht"], ["Hand", "Daumen"], ["Knie", "Gelenk"],
      ["Bauchnabel", "Mitte"], ["Glatze", "Kahl"], ["Bart", "Rasieren"], ["Muskel", "Training"],
      ["Skelett", "Knochen"], ["Blutspende", "Rotes Kreuz"], ["Lunge", "Atmen"], ["Magen", "Verdauung"],
      ["Niesen", "Hatschi"], ["Schluckauf", "Hicks"], ["Gähnen", "Müde"], ["Schnarchen", "Säge"],
      ["Husten", "Erkältung"], ["Fieber", "Thermometer"], ["Kopfschmerzen", "Tablette"], ["Gips", "Bruch"],
      ["Pflaster", "Wunde"], ["Impfung", "Pieks"], ["Sonnenbrand", "Schälen"], ["Muskelkater", "Treppe"],
      ["Allergie", "Pollen"], ["Kontaktlinsen", "Kurzsichtig"], ["Krücken", "Bein"], ["Massage", "Entspannung"],
      ["Tattoo", "Tinte"], ["Piercing", "Nasenring"], ["Sommersprossen", "Gesicht"], ["Gänsehaut", "Frieren"],
      ["Lachen", "Witz"], ["Weinen", "Tränen"], ["Kitzeln", "Fußsohlen"], ["Diät", "Kalorien"],
      ["Schwitzen", "Schweiß"], ["Zunge", "Schmecken"], ["Fingerabdruck", "Spurensicherung"], ["Haarschnitt", "Spitzen"],
      ["Ellenbogen", "Musikantenknochen"], ["Röntgen", "Durchleuchten"], ["Narkose", "Einschlafen"], ["Kater", "Zu viel getrunken"]
    ]
  }
];
