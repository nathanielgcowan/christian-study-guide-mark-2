import { BIBLE_BOOKS, findBibleBook } from "@/lib/bible";

export interface BibleTimelineEvent {
  era: string;
  label: string;
  approximateDate: string;
  summary: string;
  references: string[];
}

export interface BibleBookContext {
  book: string;
  testament: "Old Testament" | "New Testament";
  era: string;
  approximateDate: string;
  author: string;
  audience: string;
  setting: string;
  themes: string[];
  summary: string;
  outline: string[];
  whyReadIt: string;
}

export interface BibleChapterContext {
  book: string;
  chapter: number;
  title: string;
  summary: string;
  readingFocus: string[];
}

const timelineEvents: BibleTimelineEvent[] = [
  {
    era: "Beginnings",
    label: "Creation and fall",
    approximateDate: "Primeval history",
    summary: "Genesis opens with creation, humanity's calling, rebellion, and the first promise of future redemption.",
    references: ["Genesis 1-3"],
  },
  {
    era: "Patriarchs",
    label: "Abraham and covenant promise",
    approximateDate: "c. 2100-1900 BC",
    summary: "God calls Abraham and begins a covenant story that shapes the entire biblical narrative.",
    references: ["Genesis 12", "Genesis 15", "Genesis 17"],
  },
  {
    era: "Exodus and law",
    label: "Deliverance from Egypt",
    approximateDate: "c. 1446-1260 BC",
    summary: "God redeems Israel from slavery, gives the law, and forms them as a covenant people.",
    references: ["Exodus 12", "Exodus 19-20", "Deuteronomy 6"],
  },
  {
    era: "Kingdom",
    label: "Davidic kingship",
    approximateDate: "c. 1000 BC",
    summary: "The kingdom is established under David, and messianic hope is tied to his line.",
    references: ["2 Samuel 7", "Psalm 2"],
  },
  {
    era: "Exile and return",
    label: "Judgment, exile, and restoration hope",
    approximateDate: "722-445 BC",
    summary: "Israel and Judah face exile, but the prophets sustain hope for restoration and a future king.",
    references: ["2 Kings 17", "2 Kings 25", "Isaiah 40", "Ezra 1"],
  },
  {
    era: "Gospels",
    label: "Life and ministry of Jesus",
    approximateDate: "c. 4 BC-AD 30",
    summary: "Jesus announces the kingdom of God, fulfills Scripture, dies, and rises again.",
    references: ["Mark 1:14-15", "John 1:14", "Matthew 28"],
  },
  {
    era: "Church",
    label: "Spirit-empowered mission",
    approximateDate: "AD 30 onward",
    summary: "The risen Christ sends His people into the world, and the church expands through gospel witness.",
    references: ["Acts 1-2", "Acts 13", "Romans 1:16-17"],
  },
  {
    era: "Consummation",
    label: "New creation hope",
    approximateDate: "Future",
    summary: "Scripture closes with the promised return of Christ and the renewal of all things.",
    references: ["1 Corinthians 15", "Revelation 21-22"],
  },
];

const bookContexts: Record<string, Omit<BibleBookContext, "book">> = {
  Genesis: {
    testament: "Old Testament",
    era: "Beginnings and patriarchs",
    approximateDate: "Events span primeval history to c. 1800 BC",
    author: "Traditionally associated with Moses",
    audience: "Israel learning its origins and covenant story",
    setting: "From creation to the patriarchal family line",
    themes: ["Creation", "Fall", "Covenant", "Promise", "Blessing"],
    summary: "Genesis introduces the world, humanity, sin, and the covenant promises through Abraham's family.",
    outline: [
      "Chapters 1-11: creation, fall, flood, and Babel",
      "Chapters 12-25: Abraham and covenant promise",
      "Chapters 26-36: Isaac and Jacob",
      "Chapters 37-50: Joseph and providence in Egypt",
    ],
    whyReadIt: "Read Genesis to understand where the biblical story begins and why covenant, blessing, sin, and promise matter in every later book.",
  },
  Exodus: {
    testament: "Old Testament",
    era: "Exodus and law",
    approximateDate: "c. 1446-1260 BC",
    author: "Traditionally associated with Moses",
    audience: "Israel as a redeemed covenant people",
    setting: "Egypt, wilderness, and Sinai",
    themes: ["Redemption", "Covenant", "Law", "Worship", "Presence"],
    summary: "Exodus tells the story of deliverance, covenant formation, and God's dwelling among His people.",
    outline: [
      "Chapters 1-18: deliverance from Egypt",
      "Chapters 19-24: covenant and law at Sinai",
      "Chapters 25-31: tabernacle instructions",
      "Chapters 32-40: rebellion, mercy, and God's dwelling",
    ],
    whyReadIt: "Read Exodus to see redemption shape identity, worship, obedience, and the longing for God's presence.",
  },
  Psalms: {
    testament: "Old Testament",
    era: "Kingdom, exile, and worship across generations",
    approximateDate: "c. 1000-400 BC",
    author: "David and other inspired poets",
    audience: "God's people in worship, lament, trust, and praise",
    setting: "Liturgical and personal devotion across many seasons",
    themes: ["Worship", "Prayer", "Kingship", "Lament", "Hope"],
    summary: "Psalms gives voice to the full emotional and theological life of God's people before Him.",
    outline: [
      "Book 1: Psalms 1-41",
      "Book 2: Psalms 42-72",
      "Book 3: Psalms 73-89",
      "Book 4-5: Psalms 90-150 moving toward hope and praise",
    ],
    whyReadIt: "Read Psalms to learn how Scripture trains the heart to worship, lament, remember, trust, and hope in God.",
  },
  Isaiah: {
    testament: "Old Testament",
    era: "Exile and restoration hope",
    approximateDate: "8th century BC",
    author: "Isaiah",
    audience: "Judah under covenant warning and future hope",
    setting: "Before and beyond the Assyrian crisis",
    themes: ["Holiness", "Judgment", "Remnant", "Servant", "Restoration"],
    summary: "Isaiah joins urgent warning with expansive hope for redemption, the Servant, and new creation.",
    outline: [
      "Chapters 1-39: warning, holiness, and coming judgment",
      "Chapters 40-55: comfort and the Servant's work",
      "Chapters 56-66: restoration, justice, and new creation hope",
    ],
    whyReadIt: "Read Isaiah to see God's holiness, human rebellion, and the large horizon of messianic redemption.",
  },
  Matthew: {
    testament: "New Testament",
    era: "Gospels",
    approximateDate: "AD 50-70",
    author: "Matthew",
    audience: "Readers tracing Jesus as promised Messiah and king",
    setting: "The ministry, death, and resurrection of Jesus",
    themes: ["Kingdom", "Messiah", "Fulfillment", "Discipleship", "Authority"],
    summary: "Matthew presents Jesus as the promised king who fulfills Scripture and forms disciples.",
    outline: [
      "Chapters 1-4: identity and preparation of the king",
      "Chapters 5-20: teaching and kingdom ministry",
      "Chapters 21-28: conflict, cross, resurrection, and commission",
    ],
    whyReadIt: "Read Matthew to see Jesus fulfill the promises of Scripture and call disciples into kingdom life.",
  },
  John: {
    testament: "New Testament",
    era: "Gospels",
    approximateDate: "AD 80-90",
    author: "John",
    audience: "Readers invited to believe Jesus is the Christ, the Son of God",
    setting: "The signs, sayings, death, and resurrection of Jesus",
    themes: ["Belief", "Glory", "Life", "Word", "Witness"],
    summary: "John emphasizes the identity of Jesus and calls readers to believe and have life in His name.",
    outline: [
      "Chapters 1-12: signs and public ministry",
      "Chapters 13-17: upper room teaching",
      "Chapters 18-21: passion, resurrection, and restoration",
    ],
    whyReadIt: "Read John slowly to see who Jesus is, how belief works, and why eternal life is bound up with His person.",
  },
  Acts: {
    testament: "New Testament",
    era: "Church",
    approximateDate: "AD 30-60s",
    author: "Luke",
    audience: "The early church and those tracing the mission of the gospel",
    setting: "Jerusalem outward to Judea, Samaria, and the nations",
    themes: ["Holy Spirit", "Mission", "Church", "Witness", "Kingdom"],
    summary: "Acts records the Spirit-empowered expansion of the gospel through the apostles and early church.",
    outline: [
      "Chapters 1-7: witness in Jerusalem",
      "Chapters 8-12: widening mission beyond Jerusalem",
      "Chapters 13-28: Paul's mission and gospel advance to Rome",
    ],
    whyReadIt: "Read Acts to watch the gospel move outward through the power of the Spirit and the witness of the church.",
  },
  Romans: {
    testament: "New Testament",
    era: "Church",
    approximateDate: "c. AD 57",
    author: "Paul",
    audience: "The church in Rome and the wider Christian movement",
    setting: "A doctrinal and pastoral letter to a mixed Jewish-Gentile church",
    themes: ["Gospel", "Righteousness", "Faith", "Grace", "Sanctification"],
    summary: "Romans explains the gospel with unusual depth, moving from sin and justification into life in the Spirit and transformed obedience.",
    outline: [
      "Chapters 1-4: sin, righteousness, and justification by faith",
      "Chapters 5-8: union with Christ, Spirit, and assurance",
      "Chapters 9-11: Israel and God's saving purposes",
      "Chapters 12-16: transformed life, church, and mission",
    ],
    whyReadIt: "Read Romans for a deep, structured vision of the gospel that shapes doctrine, assurance, holiness, and mission.",
  },
  Revelation: {
    testament: "New Testament",
    era: "Consummation",
    approximateDate: "Late 1st century AD",
    author: "John",
    audience: "Churches under pressure needing endurance and hope",
    setting: "Apocalyptic vision centered on Christ's victory",
    themes: ["Victory", "Judgment", "Worship", "Endurance", "New Creation"],
    summary: "Revelation calls the church to faithful endurance by unveiling Christ's final victory and the renewal of all things.",
    outline: [
      "Chapters 1-3: Christ and the churches",
      "Chapters 4-16: throne, seals, trumpets, and bowls",
      "Chapters 17-22: judgment, victory, and new creation",
    ],
    whyReadIt: "Read Revelation to strengthen hope, worship, and endurance by seeing history from the throne room perspective of Christ's victory.",
  },
};

const chapterContextMap: Record<string, Record<number, Omit<BibleChapterContext, "book" | "chapter">>> = {
  Genesis: {
    1: {
      title: "Creation and order",
      summary: "Genesis 1 establishes God as Creator and shows the world as ordered, good, and purposeful under His word.",
      readingFocus: ["Notice repeated patterns of God's speech and goodness.", "Watch how humanity's calling fits inside creation."],
    },
    3: {
      title: "Fall and first gospel hope",
      summary: "Genesis 3 explains the entrance of sin, shame, alienation, and the earliest promise of coming redemption.",
      readingFocus: ["Track the movement from trust to rebellion.", "Notice both judgment and mercy in God's response."],
    },
    12: {
      title: "Abraham is called",
      summary: "Genesis 12 narrows the story toward covenant promise, blessing, and the mission of God through Abraham.",
      readingFocus: ["Notice the promises God makes.", "See how obedience and faith begin the covenant storyline."],
    },
    22: {
      title: "Abraham tested",
      summary: "Genesis 22 joins faith, sacrifice, and substitution in a way that echoes forward through the Bible.",
      readingFocus: ["Watch for trust under pressure.", "Notice how provision becomes central to the scene."],
    },
  },
  Exodus: {
    3: {
      title: "The burning bush",
      summary: "God calls Moses and reveals His name, anchoring Israel's deliverance in His covenant faithfulness.",
      readingFocus: ["Pay attention to God's self-revelation.", "Notice how mission flows from divine presence."],
    },
    12: {
      title: "Passover and deliverance",
      summary: "Exodus 12 frames redemption through sacrifice, judgment, rescue, and covenant memory.",
      readingFocus: ["Notice how salvation and remembrance are tied together.", "Watch for themes that later culminate in Christ."],
    },
    20: {
      title: "The Ten Commandments",
      summary: "The covenant law shows how redeemed people are to live before God and neighbor.",
      readingFocus: ["Read the commands as covenant instruction after grace.", "Notice what they reveal about God's character."],
    },
  },
  Psalms: {
    1: {
      title: "Two ways to live",
      summary: "Psalm 1 opens the Psalter by contrasting rooted delight in God's word with the instability of the wicked.",
      readingFocus: ["Notice the connection between meditation and fruitfulness.", "Read the psalm as a doorway into the whole book."],
    },
    23: {
      title: "The shepherd's care",
      summary: "Psalm 23 portrays God's intimate guidance, protection, and sustaining presence.",
      readingFocus: ["Watch how the language moves from provision to presence.", "Consider what trust looks like in both peace and danger."],
    },
    119: {
      title: "Delight in God's word",
      summary: "Psalm 119 is a long meditation on the beauty, necessity, and guidance of God's word.",
      readingFocus: ["Notice the many ways Scripture is described.", "Read for affection and obedience, not just information."],
    },
  },
  Isaiah: {
    6: {
      title: "Isaiah's call",
      summary: "Isaiah 6 frames prophetic ministry around God's holiness, human uncleanness, cleansing, and commission.",
      readingFocus: ["Let holiness set the emotional tone.", "Notice how grace comes before mission."],
    },
    40: {
      title: "Comfort for God's people",
      summary: "Isaiah 40 shifts toward comfort, divine strength, and the grandeur of God's redeeming purposes.",
      readingFocus: ["Watch the contrast between human frailty and God's power.", "Notice how comfort is grounded in who God is."],
    },
    53: {
      title: "The suffering servant",
      summary: "Isaiah 53 centers on substitution, suffering, and redemptive healing through the servant.",
      readingFocus: ["Trace how the servant suffers for others.", "Read slowly for the language of bearing, guilt, and peace."],
    },
  },
  Matthew: {
    5: {
      title: "Kingdom righteousness begins",
      summary: "Matthew 5 introduces kingdom character and the deepened righteousness Jesus teaches in the Sermon on the Mount.",
      readingFocus: ["Notice how Jesus forms the heart, not just behavior.", "Watch how blessing and obedience are redefined."],
    },
    13: {
      title: "Parables of the kingdom",
      summary: "Matthew 13 gathers kingdom parables that reveal both the hiddenness and certainty of God's reign.",
      readingFocus: ["Read each parable for what it reveals about the kingdom.", "Notice why response matters."],
    },
    28: {
      title: "Resurrection and commission",
      summary: "Matthew 28 ends with the risen Christ's authority and the global mission of disciple-making.",
      readingFocus: ["Notice how resurrection grounds mission.", "Watch how presence and obedience remain central."],
    },
  },
  John: {
    1: {
      title: "The Word becomes flesh",
      summary: "John 1 introduces Jesus as the eternal Word, true light, and Son who reveals the Father.",
      readingFocus: ["Pay attention to the identity claims about Jesus.", "Notice how witness and belief are introduced immediately."],
    },
    3: {
      title: "New birth and God's love",
      summary: "John 3 centers on spiritual rebirth, belief, and the saving mission of the Son.",
      readingFocus: ["Track the contrast between earthly confusion and heavenly truth.", "Read belief and eternal life as present realities rooted in Christ."],
    },
    15: {
      title: "Abide in Christ",
      summary: "John 15 presses into union with Christ, fruitfulness, obedience, and love.",
      readingFocus: ["Watch how abiding shapes fruit and prayer.", "Notice that love and obedience are inseparable in discipleship."],
    },
    21: {
      title: "Restoration and calling",
      summary: "John 21 restores Peter, confirms witness, and closes the gospel with renewed discipleship.",
      readingFocus: ["Notice how grace restores failure.", "Watch how love for Christ moves toward shepherding and witness."],
    },
  },
  Acts: {
    1: {
      title: "The church is commissioned",
      summary: "Acts 1 frames the story around the risen Christ, the coming Spirit, and witness to the ends of the earth.",
      readingFocus: ["Notice how mission is geographically structured.", "Read expectancy and dependence together."],
    },
    2: {
      title: "Pentecost",
      summary: "Acts 2 records the Spirit's coming, gospel proclamation, repentance, and the birth of the church's public witness.",
      readingFocus: ["Track how promise becomes fulfillment.", "Notice word, Spirit, repentance, and community together."],
    },
    17: {
      title: "Paul in Athens",
      summary: "Acts 17 shows contextualized witness that still speaks clearly about creation, repentance, and resurrection.",
      readingFocus: ["Watch how Paul engages culture without losing the gospel.", "Notice the call to repentance at the center."],
    },
  },
  Romans: {
    1: {
      title: "The gospel revealed",
      summary: "Romans 1 introduces the gospel as God's saving power and begins Paul's argument about humanity's need.",
      readingFocus: ["Notice how righteousness, faith, and gospel are introduced.", "Watch the movement from good news to human rebellion."],
    },
    5: {
      title: "Peace, hope, and Adam-Christ contrast",
      summary: "Romans 5 joins justification with peace, hope in suffering, and the contrast between Adam and Christ.",
      readingFocus: ["Track the change in status produced by justification.", "Notice how Christ's obedience reshapes the human story."],
    },
    8: {
      title: "Life in the Spirit",
      summary: "Romans 8 gathers assurance, adoption, sanctification, suffering, and inseparable love in Christ.",
      readingFocus: ["Read for assurance without flattening the call to holiness.", "Notice how Spirit, sonship, suffering, and hope interlock."],
    },
    12: {
      title: "A transformed life",
      summary: "Romans 12 turns gospel doctrine toward worship-shaped daily life, humility, service, and love.",
      readingFocus: ["Watch how mercy leads to practical transformation.", "Notice how worship and community ethics belong together."],
    },
  },
  Revelation: {
    1: {
      title: "The risen Christ unveiled",
      summary: "Revelation 1 introduces the glorified Christ and prepares the church to read everything that follows in light of His authority.",
      readingFocus: ["Let the vision of Christ set the tone for the book.", "Notice how comfort and awe come together."],
    },
    4: {
      title: "The throne room",
      summary: "Revelation 4 shifts perspective from earth to heaven and roots history in divine sovereignty and worship.",
      readingFocus: ["Read the imagery as worship-forming, not merely puzzling.", "Notice how the throne governs the rest of the vision."],
    },
    21: {
      title: "New creation",
      summary: "Revelation 21 gives the church a final horizon of God's presence, renewal, and the end of death and sorrow.",
      readingFocus: ["Notice how hope is embodied and communal.", "Read the promise of God's dwelling as the goal of redemption."],
    },
  },
};

function getCanonicalBookName(book: string) {
  return findBibleBook(book)?.name ?? book;
}

function isOldTestamentBook(book: string) {
  const normalized = findBibleBook(book);
  return normalized
    ? BIBLE_BOOKS.indexOf(normalized) <= BIBLE_BOOKS.findIndex((entry) => entry.name === "Malachi")
    : true;
}

function buildFallbackBookContext(book: string): BibleBookContext {
  const isOldTestament = isOldTestamentBook(book);

  return {
    book,
    testament: isOldTestament ? "Old Testament" : "New Testament",
    era: isOldTestament ? "Old Testament history" : "New Testament church era",
    approximateDate: isOldTestament ? "Old Testament period" : "1st century AD",
    author: "Author context still being expanded",
    audience: "Readers within the unfolding covenant story of Scripture",
    setting: "This book belongs within the larger biblical storyline and benefits from nearby canonical context.",
    themes: ["Covenant", "Worship", "Redemption"],
    summary: `Read ${book} in light of the larger biblical story, paying attention to covenant, redemption, and how the book advances God's purposes.`,
    outline: [
      "Opening movement: note how the book introduces its main burden or story",
      "Middle movement: watch repeated themes, promises, commands, or conflicts",
      "Closing movement: notice how the book resolves, intensifies, or points forward",
    ],
    whyReadIt: `Read ${book} with an eye for where it sits in the canon, what it reveals about God, and how it contributes to the larger story of redemption.`,
  };
}

function buildFallbackChapterContext(book: string, chapter: number): BibleChapterContext {
  const bookContext = getBookContext(book);

  return {
    book,
    chapter,
    title: `Chapter ${chapter} in context`,
    summary: `${book} ${chapter} should be read within the larger movement of ${bookContext.book}, paying attention to how this chapter advances the book's main themes of ${bookContext.themes.slice(0, 3).join(", ").toLowerCase()}.`,
    readingFocus: [
      "Look for repeated words, contrasts, promises, or commands.",
      "Notice how this chapter connects to what comes before and after it.",
      "Ask what the chapter reveals about God's character and His purposes.",
    ],
  };
}

export function getBibleTimelineEvents() {
  return timelineEvents;
}

export function getBookContext(book: string): BibleBookContext {
  const canonicalBook = getCanonicalBookName(book);
  const current = bookContexts[canonicalBook];

  if (current) {
    return {
      book: canonicalBook,
      ...current,
    };
  }

  return buildFallbackBookContext(canonicalBook);
}

export function getChapterContext(book: string, chapter: number): BibleChapterContext {
  const canonicalBook = getCanonicalBookName(book);
  const current = chapterContextMap[canonicalBook]?.[chapter];

  if (current) {
    return {
      book: canonicalBook,
      chapter,
      ...current,
    };
  }

  return buildFallbackChapterContext(canonicalBook, chapter);
}

export function getReferenceContext(reference: string) {
  const matchedBook =
    BIBLE_BOOKS
      .slice()
      .sort((left, right) => right.name.length - left.name.length)
      .find((entry) => reference.toLowerCase().startsWith(entry.name.toLowerCase()));

  const book = matchedBook?.name ?? reference.split(" ")[0] ?? reference;
  const bookContext = getBookContext(book);
  const timeline = timelineEvents.filter(
    (event) =>
      event.era === bookContext.era ||
      event.references.some((item) => item.toLowerCase().startsWith(book.toLowerCase())),
  );

  const chapterMatch = reference.match(/(\d+)(?::\d+)?/);
  const chapter = chapterMatch ? Number(chapterMatch[1]) : 1;

  return {
    book,
    bookContext,
    chapterContext: getChapterContext(book, chapter),
    timeline: timeline.length > 0 ? timeline : timelineEvents.slice(0, 3),
  };
}
