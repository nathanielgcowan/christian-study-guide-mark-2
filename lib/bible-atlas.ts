export interface BibleLocation {
  slug: string;
  name: string;
  region: string;
  era: string;
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

export const bibleLocations: BibleLocation[] = [
  {
    slug: "jerusalem",
    name: "Jerusalem",
    region: "Judah",
    era: "Kingdom to church era",
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
    summary: "The Jordan River appears in Israel's entrance into the land and in the baptism ministry surrounding Jesus.",
    significance: "It often marks transition, preparation, promise, and public identification with God's saving work.",
    keyReferences: ["Joshua 3", "2 Kings 2", "Matthew 3", "John 1"],
    relatedCharacters: ["joshua", "elijah", "john-the-baptist", "jesus"],
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

const locationMap = new Map(bibleLocations.map((entry) => [entry.slug, entry]));
const characterMap = new Map(bibleCharacters.map((entry) => [entry.slug, entry]));

export function getBibleLocations() {
  return [...bibleLocations].sort((left, right) => left.name.localeCompare(right.name));
}

export function getBibleCharacters() {
  return [...bibleCharacters].sort((left, right) => left.name.localeCompare(right.name));
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
      locations: ["jerusalem", "ephesus", "rome"],
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
