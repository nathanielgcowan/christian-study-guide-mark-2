export interface BibleLocation {
  slug: string;
  name: string;
  region: string;
  era: string;
  coordinates: {
    x: number;
    y: number;
  };
  mapLabel: string;
  summary: string;
  significance: string;
  keyReferences: string[];
  relatedCharacters: string[];
}

export interface BibleCharacter {
  slug: string;
  name: string;
  era: string;
  summary: string;
  significance: string;
  keyReferences: string[];
  relatedLocations: string[];
  themes: string[];
}

export interface AtlasJourney {
  slug: string;
  title: string;
  era: string;
  summary: string;
  focus: string;
  stops: string[];
  keyReferences: string[];
}

export const bibleLocations: BibleLocation[] = [
  {
    slug: "jerusalem",
    name: "Jerusalem",
    region: "Judah",
    era: "Kingdom to church era",
    coordinates: { x: 57, y: 58 },
    mapLabel: "Temple city",
    summary: "Jerusalem becomes the royal city of David, the temple city, and a major center in the ministry of Jesus and the early church.",
    significance: "Jerusalem ties together kingship, worship, sacrifice, prophetic hope, crucifixion, resurrection witness, and Pentecost.",
    keyReferences: ["2 Samuel 5", "Psalm 122", "Luke 19", "Acts 2"],
    relatedCharacters: ["david", "isaiah", "jesus", "peter"],
  },
  {
    slug: "bethlehem",
    name: "Bethlehem",
    region: "Judah",
    era: "Judges to gospels",
    coordinates: { x: 55, y: 61 },
    mapLabel: "Davidic birthplace",
    summary: "Bethlehem is remembered as David's hometown and the birthplace of Jesus.",
    significance: "The city reinforces God's pattern of bringing redemptive history forward through humble places and fulfilled promise.",
    keyReferences: ["Ruth 1", "1 Samuel 16", "Micah 5:2", "Luke 2"],
    relatedCharacters: ["david", "ruth", "mary", "jesus"],
  },
  {
    slug: "nazareth",
    name: "Nazareth",
    region: "Galilee",
    era: "Gospels",
    coordinates: { x: 46, y: 34 },
    mapLabel: "Hidden hometown",
    summary: "Nazareth is the hometown setting associated with Jesus' upbringing and early identity in the gospels.",
    significance: "Nazareth highlights the humility of Christ's earthly life and the surprising way God's kingdom appears.",
    keyReferences: ["Matthew 2:23", "Luke 1:26", "Luke 4:16", "John 1:46"],
    relatedCharacters: ["mary", "jesus"],
  },
  {
    slug: "sea-of-galilee",
    name: "Sea of Galilee",
    region: "Galilee",
    era: "Gospels",
    coordinates: { x: 54, y: 31 },
    mapLabel: "Teaching shoreline",
    summary: "The Sea of Galilee surrounds much of Jesus' public teaching, calling of disciples, and miracle ministry.",
    significance: "This setting gathers themes of calling, discipleship, provision, authority over creation, and gospel mission.",
    keyReferences: ["Matthew 4", "Mark 4", "John 6", "John 21"],
    relatedCharacters: ["jesus", "peter", "john-the-baptist"],
  },
  {
    slug: "mount-sinai",
    name: "Mount Sinai",
    region: "Wilderness",
    era: "Exodus and law",
    coordinates: { x: 18, y: 75 },
    mapLabel: "Covenant mountain",
    summary: "Sinai is the mountain where Israel receives the covenant law after redemption from Egypt.",
    significance: "Sinai is central for understanding covenant, holiness, worship, obedience, and God's dwelling with His people.",
    keyReferences: ["Exodus 19-20", "Exodus 24", "Exodus 34", "Deuteronomy 5"],
    relatedCharacters: ["moses", "aaron"],
  },
  {
    slug: "babylon",
    name: "Babylon",
    region: "Mesopotamia",
    era: "Exile and prophetic hope",
    coordinates: { x: 88, y: 21 },
    mapLabel: "Exile empire",
    summary: "Babylon is both a historical empire and a symbolic biblical image of proud rebellion against God.",
    significance: "It frames exile, judgment, longing for restoration, and later apocalyptic contrast with God's city.",
    keyReferences: ["2 Kings 25", "Daniel 1", "Psalm 137", "Revelation 18"],
    relatedCharacters: ["daniel", "ezekiel", "isaiah"],
  },
  {
    slug: "rome",
    name: "Rome",
    region: "Italy",
    era: "Church era",
    coordinates: { x: 9, y: 17 },
    mapLabel: "Imperial capital",
    summary: "Rome stands as the capital of imperial power and an important destination in the spread of the gospel.",
    significance: "It shows the gospel moving into the heart of the nations and helps frame the letter to the Romans and Paul's mission.",
    keyReferences: ["Acts 28", "Romans 1", "2 Timothy 4"],
    relatedCharacters: ["paul", "peter"],
  },
  {
    slug: "ephesus",
    name: "Ephesus",
    region: "Asia Minor",
    era: "Church era",
    coordinates: { x: 23, y: 28 },
    mapLabel: "Mission hub",
    summary: "Ephesus is a major New Testament ministry center connected with Paul's mission and later church leadership.",
    significance: "It helps readers trace gospel witness, discipleship, spiritual warfare, and church maturity in the early Christian movement.",
    keyReferences: ["Acts 19", "Ephesians 1", "1 Timothy 1", "Revelation 2"],
    relatedCharacters: ["paul", "timothy", "john"],
  },
  {
    slug: "corinth",
    name: "Corinth",
    region: "Achaia",
    era: "Church era",
    coordinates: { x: 16, y: 32 },
    mapLabel: "Church in tension",
    summary: "Corinth is a strategic but complicated church setting in the New Testament letters.",
    significance: "It illuminates discipleship in a morally complex culture and many core issues of church life, holiness, and love.",
    keyReferences: ["Acts 18", "1 Corinthians 1", "1 Corinthians 13", "2 Corinthians 5"],
    relatedCharacters: ["paul", "apollos"],
  },
  {
    slug: "jordan-river",
    name: "Jordan River",
    region: "Jordan Valley",
    era: "Conquest to gospels",
    coordinates: { x: 60, y: 46 },
    mapLabel: "Threshold waters",
    summary: "The Jordan River appears in Israel's entrance into the land and in the baptism ministry surrounding Jesus.",
    significance: "It often marks transition, preparation, promise, and public identification with God's saving work.",
    keyReferences: ["Joshua 3", "2 Kings 2", "Matthew 3", "John 1"],
    relatedCharacters: ["joshua", "elijah", "john-the-baptist", "jesus"],
  },
  {
    slug: "jericho",
    name: "Jericho",
    region: "Jordan Valley",
    era: "Conquest to gospels",
    coordinates: { x: 58, y: 52 },
    mapLabel: "First crossing city",
    summary: "Jericho appears at Israel's first conquest victory and later as a setting in Jesus' healing and salvation ministry.",
    significance: "Jericho joins conquest, covenant fulfillment, mercy, and the surprising welcome of grace in both Testaments.",
    keyReferences: ["Joshua 6", "2 Kings 2", "Luke 10:30-37", "Luke 19:1-10"],
    relatedCharacters: ["joshua", "jesus"],
  },
  {
    slug: "capernaum",
    name: "Capernaum",
    region: "Galilee",
    era: "Gospels",
    coordinates: { x: 56, y: 28 },
    mapLabel: "Jesus' ministry base",
    summary: "Capernaum functions as a key ministry base for Jesus around the Sea of Galilee.",
    significance: "It gathers preaching, healing, discipleship, authority, and the escalating response to Jesus' public work.",
    keyReferences: ["Mark 1:21-39", "Matthew 8:5-17", "John 6:24-59"],
    relatedCharacters: ["jesus", "peter"],
  },
  {
    slug: "caesarea-maritime",
    name: "Caesarea Maritima",
    region: "Coastal Plain",
    era: "Church era",
    coordinates: { x: 45, y: 49 },
    mapLabel: "Coastal gateway",
    summary: "Caesarea is a strategic Roman port city tied to Cornelius, Paul, and the widening reach of the gospel.",
    significance: "It highlights Gentile inclusion, political power, missionary transition, and gospel witness before rulers.",
    keyReferences: ["Acts 10", "Acts 12", "Acts 23-26"],
    relatedCharacters: ["peter", "paul"],
  },
  {
    slug: "damascus",
    name: "Damascus",
    region: "Syria",
    era: "Church era",
    coordinates: { x: 72, y: 16 },
    mapLabel: "Conversion road",
    summary: "Damascus is forever linked to Saul's conversion and early proclamation of Jesus.",
    significance: "It marks dramatic repentance, calling, and the redirection of zeal into gospel mission.",
    keyReferences: ["Acts 9", "Acts 22", "Acts 26"],
    relatedCharacters: ["paul"],
  },
  {
    slug: "antioch",
    name: "Antioch",
    region: "Syria",
    era: "Church era",
    coordinates: { x: 44, y: 12 },
    mapLabel: "Sending church",
    summary: "Antioch becomes a major church center where believers are first called Christians and from which mission is launched.",
    significance: "It shows cross-cultural church life, shared leadership, generosity, and outward gospel sending.",
    keyReferences: ["Acts 11:19-30", "Acts 13:1-3", "Galatians 2:11-14"],
    relatedCharacters: ["paul", "peter"],
  },
  {
    slug: "samaria",
    name: "Samaria",
    region: "Central Hill Country",
    era: "Kingdom to church era",
    coordinates: { x: 51, y: 47 },
    mapLabel: "Crossing old divides",
    summary: "Samaria carries the memory of a divided kingdom and becomes a key setting in the widening reach of Jesus' ministry and the early church.",
    significance: "It brings together division, mercy, outsider welcome, and the spread of the gospel beyond familiar boundaries.",
    keyReferences: ["1 Kings 16", "John 4", "Luke 10:25-37", "Acts 8"],
    relatedCharacters: ["jesus", "peter"],
  },
  {
    slug: "patmos",
    name: "Patmos",
    region: "Aegean",
    era: "Church era",
    coordinates: { x: 27, y: 24 },
    mapLabel: "Island of revelation",
    summary: "Patmos is the island of John's exile and the setting of the Revelation vision.",
    significance: "It frames suffering, prophetic witness, heavenly perspective, and hope for the churches under pressure.",
    keyReferences: ["Revelation 1", "Revelation 4-5", "Revelation 21-22"],
    relatedCharacters: ["john"],
  },
];

export const bibleCharacters: BibleCharacter[] = [
  {
    slug: "abraham",
    name: "Abraham",
    era: "Patriarchs",
    summary: "Abraham is called by God to leave his homeland and becomes the covenant patriarch through whom blessing is promised to the nations.",
    significance: "His story shapes covenant, faith, promise, justification, and the biblical storyline of redemptive blessing.",
    keyReferences: ["Genesis 12", "Genesis 15", "Genesis 22", "Romans 4"],
    relatedLocations: ["babylon", "mount-sinai"],
    themes: ["Covenant", "Faith", "Promise"],
  },
  {
    slug: "moses",
    name: "Moses",
    era: "Exodus and law",
    summary: "Moses leads Israel out of Egypt, mediates the covenant, and shepherds the people in the wilderness.",
    significance: "He is central for redemption, law, covenant mediation, worship, and the expectation of a greater deliverer.",
    keyReferences: ["Exodus 3", "Exodus 12", "Exodus 20", "Deuteronomy 34"],
    relatedLocations: ["mount-sinai", "jordan-river"],
    themes: ["Deliverance", "Law", "Leadership"],
  },
  {
    slug: "david",
    name: "David",
    era: "Kingdom",
    summary: "David is the shepherd-king whose reign anchors Israel's royal hope and many of the Psalms.",
    significance: "He shapes messianic expectation, worship, kingship, repentance, and covenant hope.",
    keyReferences: ["1 Samuel 16", "2 Samuel 7", "Psalm 23", "Acts 13:22-23"],
    relatedLocations: ["bethlehem", "jerusalem"],
    themes: ["Kingship", "Worship", "Repentance"],
  },
  {
    slug: "isaiah",
    name: "Isaiah",
    era: "Prophetic era",
    summary: "Isaiah is a prophet of holiness, judgment, comfort, and future messianic restoration.",
    significance: "His book deeply shapes biblical theology around the Servant, redemption, Zion, and new creation.",
    keyReferences: ["Isaiah 6", "Isaiah 40", "Isaiah 53", "Isaiah 65"],
    relatedLocations: ["jerusalem", "babylon"],
    themes: ["Holiness", "Judgment", "Restoration"],
  },
  {
    slug: "ruth",
    name: "Ruth",
    era: "Judges",
    summary: "Ruth is a Moabite widow whose loyalty and faith become part of God's redemptive line leading to David.",
    significance: "Her story shows covenant kindness, belonging, providence, and God's care for outsiders.",
    keyReferences: ["Ruth 1", "Ruth 2", "Ruth 4", "Matthew 1:5"],
    relatedLocations: ["bethlehem"],
    themes: ["Providence", "Faithfulness", "Redemption"],
  },
  {
    slug: "mary",
    name: "Mary",
    era: "Gospels",
    summary: "Mary receives the promise of Jesus' birth and responds in humble faith and worship.",
    significance: "She helps frame incarnation, obedience, wonder, and the fulfillment of covenant hope in Christ.",
    keyReferences: ["Luke 1", "Luke 2", "John 2", "Acts 1:14"],
    relatedLocations: ["nazareth", "bethlehem", "jerusalem"],
    themes: ["Incarnation", "Humility", "Faith"],
  },
  {
    slug: "jesus",
    name: "Jesus",
    era: "Gospels",
    summary: "Jesus is the promised Messiah, Son of God, crucified and risen Lord, and the center of all Scripture.",
    significance: "Every major biblical theme finds fulfillment in Christ, including covenant, kingdom, sacrifice, salvation, and new creation.",
    keyReferences: ["Matthew 5-7", "John 1", "John 3", "Luke 24"],
    relatedLocations: ["nazareth", "bethlehem", "jerusalem", "sea-of-galilee", "jordan-river"],
    themes: ["Messiah", "Salvation", "Kingdom"],
  },
  {
    slug: "john-the-baptist",
    name: "John the Baptist",
    era: "Gospels",
    summary: "John the Baptist prepares the way for Jesus through preaching repentance and announcing the coming kingdom.",
    significance: "He bridges prophetic expectation and gospel fulfillment while pointing beyond himself to Christ.",
    keyReferences: ["Isaiah 40:3", "Matthew 3", "John 1:19-34", "John 3:30"],
    relatedLocations: ["jordan-river", "sea-of-galilee"],
    themes: ["Repentance", "Witness", "Preparation"],
  },
  {
    slug: "peter",
    name: "Peter",
    era: "Gospels and church era",
    summary: "Peter is a disciple, apostle, and prominent early church leader whose life reflects both weakness and restoration.",
    significance: "His story is pastorally powerful for discipleship, courage, failure, forgiveness, and witness.",
    keyReferences: ["Matthew 16", "Luke 22", "John 21", "Acts 2"],
    relatedLocations: ["sea-of-galilee", "jerusalem", "rome"],
    themes: ["Discipleship", "Restoration", "Witness"],
  },
  {
    slug: "paul",
    name: "Paul",
    era: "Church era",
    summary: "Paul is the apostle to the Gentiles whose mission journeys and letters shape the church's understanding of the gospel.",
    significance: "He helps readers trace doctrine, mission, church formation, suffering, and union with Christ.",
    keyReferences: ["Acts 9", "Acts 17", "Acts 20", "Romans 1"],
    relatedLocations: ["rome", "ephesus", "corinth", "jerusalem"],
    themes: ["Mission", "Gospel", "Church"],
  },
  {
    slug: "esther",
    name: "Esther",
    era: "Exile and return",
    summary: "Esther risks her life within the Persian court to protect God's people from destruction.",
    significance: "Her story highlights providence, courage, preservation, and faithfulness in exile.",
    keyReferences: ["Esther 4", "Esther 5", "Esther 8", "Esther 9"],
    relatedLocations: ["babylon"],
    themes: ["Providence", "Courage", "Preservation"],
  },
  {
    slug: "daniel",
    name: "Daniel",
    era: "Exile",
    summary: "Daniel lives faithfully in Babylon while receiving visions that strengthen hope in God's kingdom.",
    significance: "He helps readers understand endurance, holiness in exile, prayer, and the sovereignty of God over kingdoms.",
    keyReferences: ["Daniel 1", "Daniel 6", "Daniel 7", "Daniel 9"],
    relatedLocations: ["babylon"],
    themes: ["Faithfulness", "Kingdom", "Prayer"],
  },
];

export const atlasJourneys: AtlasJourney[] = [
  {
    slug: "exodus-route",
    title: "The Exodus Route",
    era: "Exodus and law",
    summary: "Trace redemption from deliverance out of Egypt to covenant formation and entry toward the promised land.",
    focus: "Deliverance, covenant, wilderness formation, and the presence of God.",
    stops: ["mount-sinai", "jordan-river", "jericho"],
    keyReferences: ["Exodus 12", "Exodus 19-20", "Deuteronomy 8", "Joshua 3"],
  },
  {
    slug: "kingdom-hope",
    title: "From Bethlehem to Jerusalem",
    era: "Kingdom to messianic hope",
    summary: "Follow the rise of Davidic kingship and the way royal hope points beyond itself toward the Messiah.",
    focus: "Kingship, covenant promise, worship, and messianic expectation.",
    stops: ["bethlehem", "jerusalem"],
    keyReferences: ["1 Samuel 16", "2 Samuel 7", "Psalm 122", "Micah 5:2"],
  },
  {
    slug: "jesus-ministry",
    title: "The Ministry of Jesus",
    era: "Gospels",
    summary: "Move through the places most closely tied to the incarnation, baptism, public ministry, and climactic work of Christ.",
    focus: "Incarnation, discipleship, proclamation, miracle, cross, and resurrection.",
    stops: ["bethlehem", "nazareth", "jordan-river", "capernaum", "sea-of-galilee", "jericho", "jerusalem"],
    keyReferences: ["Luke 1-2", "Matthew 3", "Mark 1", "Luke 19", "John 20"],
  },
  {
    slug: "paul-mission",
    title: "Paul's Mission Journey Arc",
    era: "Church era",
    summary: "Track the spread of the gospel through major ministry centers that shaped the New Testament church.",
    focus: "Mission, church planting, endurance, and the gospel reaching the nations.",
    stops: ["jerusalem", "caesarea-maritime", "antioch", "ephesus", "corinth", "rome"],
    keyReferences: ["Acts 13", "Acts 18", "Acts 19", "Acts 28", "Romans 1"],
  },
  {
    slug: "exile-restoration",
    title: "Exile and Restoration Hope",
    era: "Exile and prophetic hope",
    summary: "See how judgment, exile, and restoration hope are anchored in specific places across the biblical story.",
    focus: "Judgment, faithfulness in exile, prophetic hope, and restoration.",
    stops: ["jerusalem", "babylon"],
    keyReferences: ["2 Kings 25", "Psalm 137", "Daniel 1", "Isaiah 40", "Revelation 18"],
  },
  {
    slug: "gospel-to-the-nations",
    title: "From Jerusalem to the Nations",
    era: "Church era",
    summary: "Follow the widening arc of Acts from Jerusalem through boundary-crossing cities into the Gentile world.",
    focus: "Witness, Spirit-empowered expansion, Gentile inclusion, and gospel momentum.",
    stops: ["jerusalem", "samaria", "caesarea-maritime", "damascus", "antioch", "rome"],
    keyReferences: ["Acts 1:8", "Acts 8", "Acts 9", "Acts 10", "Acts 11", "Acts 28"],
  },
];

const locationMap = new Map(bibleLocations.map((entry) => [entry.slug, entry]));
const characterMap = new Map(bibleCharacters.map((entry) => [entry.slug, entry]));

export function getBibleLocations() {
  return [...bibleLocations].sort((left, right) => left.name.localeCompare(right.name));
}

export function getBibleCharacters() {
  return [...bibleCharacters].sort((left, right) => left.name.localeCompare(right.name));
}

export function getAtlasJourneys() {
  return [...atlasJourneys];
}

export function getBibleLocationBySlug(slug: string) {
  return locationMap.get(slug);
}

export function getBibleCharacterBySlug(slug: string) {
  return characterMap.get(slug);
}

export function getRelatedCharactersForLocation(location: BibleLocation) {
  return location.relatedCharacters
    .map((slug) => getBibleCharacterBySlug(slug))
    .filter((entry): entry is BibleCharacter => Boolean(entry));
}

export function getRelatedLocationsForCharacter(character: BibleCharacter) {
  return character.relatedLocations
    .map((slug) => getBibleLocationBySlug(slug))
    .filter((entry): entry is BibleLocation => Boolean(entry));
}

export function getJourneysForLocation(location: BibleLocation) {
  return atlasJourneys.filter((journey) => journey.stops.includes(location.slug));
}

export function getSuggestedAtlasContext(reference: string) {
  const normalized = reference.toLowerCase();

  const presets: Array<{
    matcher: (value: string) => boolean;
    characters: string[];
    locations: string[];
  }> = [
    {
      matcher: (value) => value.startsWith("genesis"),
      characters: ["abraham"],
      locations: ["babylon"],
    },
    {
      matcher: (value) => value.startsWith("exodus") || value.startsWith("deuteronomy"),
      characters: ["moses"],
      locations: ["mount-sinai"],
    },
    {
      matcher: (value) => value.startsWith("ruth") || value.startsWith("1 samuel") || value.startsWith("2 samuel") || value.startsWith("psalm"),
      characters: ["david", "ruth"],
      locations: ["bethlehem", "jerusalem"],
    },
    {
      matcher: (value) => value.startsWith("isaiah") || value.startsWith("daniel") || value.startsWith("esther"),
      characters: ["isaiah", "daniel", "esther"],
      locations: ["jerusalem", "babylon"],
    },
    {
      matcher: (value) => value.startsWith("matthew") || value.startsWith("mark") || value.startsWith("luke") || value.startsWith("john"),
      characters: ["jesus", "mary", "john-the-baptist", "peter"],
      locations: ["nazareth", "bethlehem", "sea-of-galilee", "jerusalem", "jordan-river"],
    },
    {
      matcher: (value) => value.startsWith("acts"),
      characters: ["peter", "paul"],
      locations: ["jerusalem", "samaria", "caesarea-maritime", "antioch"],
    },
    {
      matcher: (value) => value.startsWith("romans") || value.startsWith("1 corinthians") || value.startsWith("2 corinthians") || value.startsWith("ephesians"),
      characters: ["paul"],
      locations: ["rome", "corinth", "ephesus"],
    },
  ];

  const matched = presets.find((preset) => preset.matcher(normalized));

  const characters = (matched?.characters ?? ["jesus", "paul"])
    .map((slug) => getBibleCharacterBySlug(slug))
    .filter((entry): entry is BibleCharacter => Boolean(entry))
    .slice(0, 4);

  const locations = (matched?.locations ?? ["jerusalem", "rome"])
    .map((slug) => getBibleLocationBySlug(slug))
    .filter((entry): entry is BibleLocation => Boolean(entry))
    .slice(0, 4);

  return {
    characters,
    locations,
  };
}
