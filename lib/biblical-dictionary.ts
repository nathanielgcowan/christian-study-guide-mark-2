export interface BiblicalDictionaryEntry {
  term: string;
  slug: string;
  category: "person" | "place" | "theme" | "practice" | "theology";
  summary: string;
  definition: string;
  keyReferences: string[];
  relatedTerms: string[];
  whyItMatters?: string;
  aliases?: string[];
}

const coreBiblicalDictionaryEntries: BiblicalDictionaryEntry[] = [
  {
    term: "Atonement",
    slug: "atonement",
    category: "theology",
    summary: "God's work of reconciling sinners to Himself through sacrifice and ultimately through Christ.",
    definition:
      "Atonement describes the way sin is dealt with so that fellowship with God can be restored. In Scripture it is tied to sacrifice, cleansing, forgiveness, and finally the once-for-all saving work of Jesus.",
    keyReferences: ["Leviticus 16", "Romans 3:23-26", "1 John 2:1-2"],
    relatedTerms: ["Grace", "Justification", "Redemption"],
    whyItMatters: "Atonement helps readers understand why the cross is central to the gospel and how forgiveness can be both holy and merciful.",
  },
  {
    term: "Baptism",
    slug: "baptism",
    category: "practice",
    summary: "A public sign of union with Christ, repentance, and new life in Him.",
    definition:
      "Baptism is an act of obedience that visibly marks identification with Jesus in His death and resurrection. It does not replace faith, but it does witness to faith before the church and the world.",
    keyReferences: ["Matthew 28:19-20", "Acts 2:38", "Romans 6:3-4"],
    relatedTerms: ["Discipleship", "Repentance", "Church"],
    whyItMatters: "Baptism connects belief to public obedience and helps believers see their faith as something embodied, communal, and visible.",
  },
  {
    term: "Covenant",
    slug: "covenant",
    category: "theme",
    summary: "A binding relationship established by God with promises, responsibilities, and signs.",
    definition:
      "Covenant is one of the great threads of Scripture. God relates to His people through solemn promises and commitments that reveal His faithfulness across redemptive history.",
    keyReferences: ["Genesis 12:1-3", "Exodus 19:4-6", "Luke 22:20"],
    relatedTerms: ["Grace", "Israel", "Redemption"],
    whyItMatters: "Covenant gives readers a framework for seeing how the Bible fits together instead of treating each era as disconnected.",
  },
  {
    term: "Disciple",
    slug: "disciple",
    category: "practice",
    summary: "A learner and follower of Jesus shaped by His teaching, example, and mission.",
    definition:
      "To be a disciple is more than holding Christian beliefs. It means following Christ in trust, obedience, community, and formation over time.",
    keyReferences: ["Matthew 4:19", "Luke 9:23", "John 8:31-32"],
    relatedTerms: ["Sanctification", "Church", "Kingdom of God"],
    whyItMatters: "Disciple language keeps Christianity rooted in following Jesus, not merely agreeing with ideas about Him.",
  },
  {
    term: "Eden",
    slug: "eden",
    category: "place",
    summary: "The garden where humanity first enjoyed life with God before the fall.",
    definition:
      "Eden is the setting of humanity's original blessing, vocation, and rebellion. It serves as a starting point for themes of presence, exile, and restoration throughout the Bible.",
    keyReferences: ["Genesis 2:8-17", "Genesis 3", "Revelation 22:1-5"],
    relatedTerms: ["Creation", "Fall", "New Creation"],
    whyItMatters: "Eden helps readers trace the Bible's movement from creation and loss toward restoration and renewed fellowship with God.",
  },
  {
    term: "Faith",
    slug: "faith",
    category: "theme",
    summary: "Trusting God, His character, and His promises rather than relying on self.",
    definition:
      "Biblical faith is not vague optimism. It is confidence directed toward God Himself, expressed in dependence, obedience, and perseverance.",
    keyReferences: ["Habakkuk 2:4", "Romans 10:17", "Hebrews 11:1-6"],
    relatedTerms: ["Grace", "Justification", "Hope"],
    whyItMatters: "Faith is foundational because it describes how people receive God's promises and continue walking with Him.",
  },
  {
    term: "Grace",
    slug: "grace",
    category: "theology",
    summary: "God's undeserved favor and empowering kindness toward sinners and saints.",
    definition:
      "Grace means God acts generously toward people who cannot earn His mercy. It is central to salvation and also to the continuing Christian life.",
    keyReferences: ["Ephesians 2:8-9", "Titus 2:11-14", "2 Corinthians 12:9"],
    relatedTerms: ["Faith", "Atonement", "Sanctification"],
    whyItMatters: "Grace keeps study from becoming self-salvation and reminds readers that the Christian life begins and continues through God's initiative.",
  },
  {
    term: "Holy Spirit",
    slug: "holy-spirit",
    category: "theology",
    summary: "The third person of the Trinity who indwells, empowers, guides, and sanctifies believers.",
    definition:
      "The Holy Spirit is fully divine and personally active in creation, revelation, regeneration, and the life of the church. He glorifies Christ and applies God's work to believers.",
    keyReferences: ["John 14:16-17", "Acts 1:8", "Galatians 5:22-25"],
    relatedTerms: ["Sanctification", "Church", "Trinity"],
    whyItMatters: "Understanding the Spirit helps believers see that Christian growth, conviction, power, and comfort are not self-generated.",
  },
  {
    term: "Jerusalem",
    slug: "jerusalem",
    category: "place",
    summary: "A central city in biblical history tied to temple worship, kingship, exile, and hope.",
    definition:
      "Jerusalem becomes a focal point for God's covenant people, Davidic kingship, temple worship, prophetic warning, and messianic expectation.",
    keyReferences: ["2 Samuel 5:6-10", "Psalm 122", "Luke 19:41-44"],
    relatedTerms: ["Temple", "David", "Kingdom of God"],
    whyItMatters: "Jerusalem anchors major biblical events and helps readers place prophecy, kingship, worship, and the ministry of Jesus in context.",
  },
  {
    term: "Justification",
    slug: "justification",
    category: "theology",
    summary: "God's act of declaring sinners righteous through faith in Christ.",
    definition:
      "Justification is a legal and relational declaration rooted in Christ's work, not human merit. Believers stand accepted before God because of Jesus.",
    keyReferences: ["Romans 3:28", "Romans 5:1", "Galatians 2:16"],
    relatedTerms: ["Atonement", "Faith", "Grace"],
    whyItMatters: "Justification guards the heart of the gospel by clarifying how sinners are counted righteous before God.",
  },
  {
    term: "Kingdom of God",
    slug: "kingdom-of-god",
    category: "theme",
    summary: "God's reign, rule, and redemptive authority breaking into history and reaching fulfillment in Christ.",
    definition:
      "The kingdom of God is not merely a place but the reality of God's sovereign rule. Jesus announces, embodies, and advances this kingdom in His ministry.",
    keyReferences: ["Mark 1:14-15", "Matthew 6:10", "Revelation 11:15"],
    relatedTerms: ["Gospel", "Disciple", "New Creation"],
    whyItMatters: "Kingdom language helps readers understand Jesus' mission, ethics, miracles, and future hope as part of one larger reign of God.",
  },
  {
    term: "Messiah",
    slug: "messiah",
    category: "theme",
    summary: "The anointed deliverer promised by God and fulfilled in Jesus Christ.",
    definition:
      "Messiah means 'anointed one.' In the Bible it gathers hopes for a king, deliverer, and servant through whom God rescues and rules His people.",
    keyReferences: ["Psalm 2", "Isaiah 53", "John 1:41"],
    relatedTerms: ["Christ", "Kingdom of God", "David"],
    whyItMatters: "Messiah ties together Old Testament hope and New Testament fulfillment in the person of Jesus.",
  },
  {
    term: "Passover",
    slug: "passover",
    category: "practice",
    summary: "Israel's memorial feast recalling God's deliverance from Egypt through the blood of the lamb.",
    definition:
      "Passover remembers God's judgment passing over the homes marked by sacrificial blood. It becomes a major backdrop for understanding Christ's redemptive work.",
    keyReferences: ["Exodus 12", "Luke 22:7-20", "1 Corinthians 5:7"],
    relatedTerms: ["Covenant", "Atonement", "Redemption"],
    whyItMatters: "Passover helps readers see how Jesus' death fulfills one of Scripture's most important rescue patterns.",
  },
  {
    term: "Pentateuch",
    slug: "pentateuch",
    category: "theme",
    summary: "The first five books of the Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.",
    definition:
      "Pentateuch is a term used for the opening five books of Scripture. These books lay the foundation for creation, covenant, law, worship, wilderness testing, and the identity of God's people.",
    keyReferences: ["Genesis 1", "Exodus 20", "Leviticus 16", "Numbers 14", "Deuteronomy 6"],
    relatedTerms: ["Covenant", "Exodus", "Law"],
    whyItMatters: "Understanding the Pentateuch helps readers see the theological foundation that the rest of the Bible builds on, especially themes of creation, holiness, sacrifice, and covenant.",
  },
  {
    term: "Redemption",
    slug: "redemption",
    category: "theology",
    summary: "Deliverance secured by a price, culminating in Christ's saving work.",
    definition:
      "Redemption language draws on release, rescue, and purchase. In Scripture it points to God's power to free His people from bondage and bring them into restored life.",
    keyReferences: ["Exodus 6:6", "Ephesians 1:7", "1 Peter 1:18-19"],
    relatedTerms: ["Atonement", "Grace", "Passover"],
    whyItMatters: "Redemption shows that salvation is not abstract improvement but deliverance from slavery into belonging and freedom.",
  },
  {
    term: "Repentance",
    slug: "repentance",
    category: "practice",
    summary: "A turning from sin toward God marked by grief, faith, and changed direction.",
    definition:
      "Repentance is not mere regret. It is a Spirit-enabled turning of heart and life away from sin and back toward God in trust and obedience.",
    keyReferences: ["Isaiah 55:6-7", "Mark 1:15", "Acts 3:19"],
    relatedTerms: ["Faith", "Discipleship", "Sanctification"],
    whyItMatters: "Repentance keeps the gospel personal and practical, calling for real turning rather than only intellectual agreement.",
  },
  {
    term: "Romans",
    slug: "romans",
    category: "theme",
    summary: "Paul's New Testament letter explaining the gospel, righteousness, grace, and life in Christ with unusual depth.",
    definition:
      "Romans is an epistle written by the apostle Paul that carefully unfolds humanity's need, God's righteousness, justification by faith, union with Christ, the role of Israel, and practical Christian living.",
    keyReferences: ["Romans 1:16-17", "Romans 3:21-26", "Romans 8:1-39", "Romans 12:1-2"],
    relatedTerms: ["Gospel", "Justification", "Faith"],
    whyItMatters: "Romans is one of the clearest biblical explanations of the gospel and helps readers connect doctrine to worship, obedience, and hope.",
    aliases: ["book of romans", "romans epistle"],
  },
  {
    term: "Sanctification",
    slug: "sanctification",
    category: "theology",
    summary: "The ongoing work by which believers are made more holy in Christ.",
    definition:
      "Sanctification describes growth in holiness after conversion. God is the one who works in believers, yet believers are also called to active obedience and endurance.",
    keyReferences: ["John 17:17", "1 Thessalonians 4:3", "Philippians 2:12-13"],
    relatedTerms: ["Holy Spirit", "Grace", "Disciple"],
    whyItMatters: "Sanctification helps believers understand the slow, real process of Christian change without confusing it with justification.",
  },
  {
    term: "Temple",
    slug: "temple",
    category: "place",
    summary: "The place associated with God's dwelling presence, worship, sacrifice, and holiness.",
    definition:
      "The temple stands at the heart of Israel's worship life and points forward to greater realities fulfilled in Christ and His people.",
    keyReferences: ["1 Kings 8", "John 2:19-21", "1 Corinthians 3:16"],
    relatedTerms: ["Jerusalem", "Atonement", "Holy Spirit"],
    whyItMatters: "Temple themes explain holiness, sacrifice, presence, and why Jesus and the church are described in temple language.",
  },
  {
    term: "Trinity",
    slug: "trinity",
    category: "theology",
    summary: "The one God who eternally exists as Father, Son, and Holy Spirit.",
    definition:
      "The Trinity affirms both God's oneness and the real distinction of persons within the Godhead. Though the term itself is later, the doctrine arises from the total witness of Scripture.",
    keyReferences: ["Matthew 28:19", "John 1:1-18", "2 Corinthians 13:14"],
    relatedTerms: ["Holy Spirit", "Messiah", "Grace"],
    whyItMatters: "The Trinity shapes how Christians speak about God, worship Him, and understand salvation as the work of Father, Son, and Spirit.",
  },
  {
    term: "David",
    slug: "david",
    category: "person",
    summary: "Israel's shepherd-king whose life and line become central to messianic hope.",
    definition:
      "David is remembered as king, psalmist, warrior, and covenant recipient. His life displays both deep devotion and serious failure, while his throne becomes a major backdrop for the coming Messiah.",
    keyReferences: ["1 Samuel 16", "2 Samuel 7", "Psalm 51"],
    relatedTerms: ["Messiah", "Jerusalem", "Kingdom of God"],
    whyItMatters: "David connects historical kingship, worship, repentance, and the promise that a greater Son of David will reign forever.",
  },
  {
    term: "Exodus",
    slug: "exodus",
    category: "theme",
    summary: "God's rescuing deliverance of His people from slavery, forming a central pattern for salvation.",
    definition:
      "The exodus is both a historic event and a theological pattern. God hears His people, judges oppression, redeems them, and brings them into covenant relationship.",
    keyReferences: ["Exodus 3:7-10", "Exodus 12", "Luke 9:30-31"],
    relatedTerms: ["Passover", "Redemption", "Covenant"],
    whyItMatters: "Exodus imagery shapes how later Scripture explains rescue, worship, holiness, and God's faithfulness to save.",
  },
  {
    term: "Gospel",
    slug: "gospel",
    category: "theme",
    summary: "The good news of what God has done in Jesus Christ to save sinners and establish His kingdom.",
    definition:
      "The gospel centers on Jesus' life, death, resurrection, and lordship. It is not merely advice for living but the announcement of God's saving act in history.",
    keyReferences: ["Mark 1:1", "1 Corinthians 15:1-4", "Romans 1:16-17"],
    relatedTerms: ["Grace", "Kingdom of God", "Justification"],
    whyItMatters: "The gospel is the center of Christian faith and the interpretive key for understanding the work of Christ.",
  },
  {
    term: "Hope",
    slug: "hope",
    category: "theme",
    summary: "Confident expectation rooted in God's promises rather than uncertain wishfulness.",
    definition:
      "Biblical hope looks forward with confidence because God is faithful. It is tied to resurrection, endurance, inheritance, and the return of Christ.",
    keyReferences: ["Romans 5:1-5", "Romans 8:24-25", "1 Peter 1:3-5"],
    relatedTerms: ["Faith", "New Creation", "Grace"],
    whyItMatters: "Hope strengthens endurance and keeps suffering from having the final word in the Christian life.",
  },
  {
    term: "Israel",
    slug: "israel",
    category: "person",
    summary: "The covenant people descended from the patriarchs and central to the unfolding story of redemption.",
    definition:
      "Israel can refer to Jacob himself, the nation that came from him, or the covenant people more broadly in Scripture. The term is deeply tied to election, promise, law, exile, and restoration.",
    keyReferences: ["Genesis 32:28", "Exodus 19:4-6", "Romans 9:1-5"],
    relatedTerms: ["Covenant", "Exodus", "Jerusalem"],
    whyItMatters: "Israel is essential for understanding the historical and covenant framework in which the Messiah comes.",
  },
  {
    term: "New Creation",
    slug: "new-creation",
    category: "theme",
    summary: "God's renewing work that culminates in the restoration of all things in Christ.",
    definition:
      "New creation language points to both present renewal in Christ and the future restoration of heaven and earth. It gathers themes of resurrection, holiness, healing, and hope.",
    keyReferences: ["Isaiah 65:17", "2 Corinthians 5:17", "Revelation 21:1-5"],
    relatedTerms: ["Eden", "Kingdom of God", "Hope"],
    whyItMatters: "New creation helps readers see that salvation is not escape from creation but its final renewal under Christ.",
  },
  {
    term: "Prayer",
    slug: "prayer",
    category: "practice",
    summary: "Communion with God through praise, confession, thanksgiving, petition, and intercession.",
    definition:
      "Prayer is a central expression of dependence on God. Scripture presents it as relational, honest, shaped by God's character, and strengthened through faith.",
    keyReferences: ["Psalm 62:8", "Matthew 6:5-13", "Philippians 4:6-7"],
    relatedTerms: ["Faith", "Holy Spirit", "Grace"],
    whyItMatters: "Prayer moves study from observation into relationship, dependence, and worship.",
  },
  {
    term: "Sabbath",
    slug: "sabbath",
    category: "practice",
    summary: "A God-given pattern of rest, worship, and trust that resists endless striving.",
    definition:
      "Sabbath begins in creation and becomes part of Israel's covenant life. It carries themes of rest, holiness, trust, and final restoration.",
    keyReferences: ["Genesis 2:2-3", "Exodus 20:8-11", "Mark 2:27-28"],
    relatedTerms: ["Creation", "Covenant", "Kingdom of God"],
    whyItMatters: "Sabbath teaches that rest is an act of trust and that life with God is not sustained by endless self-reliance.",
  },
  {
    term: "Zion",
    slug: "zion",
    category: "place",
    summary: "A name associated with Jerusalem that grows into a symbol of God's dwelling, reign, and future hope.",
    definition:
      "Zion begins as a geographical designation but becomes richly theological in Scripture. It speaks of God's presence, worship, kingship, and the hope of restoration.",
    keyReferences: ["Psalm 2:6", "Psalm 48", "Hebrews 12:22-24"],
    relatedTerms: ["Jerusalem", "Temple", "Kingdom of God"],
    whyItMatters: "Zion gathers themes of worship and hope, helping readers see how place language becomes redemptive-symbolic language in Scripture.",
  },
];

const supplementalBiblicalDictionaryEntries: BiblicalDictionaryEntry[] = [
  {
    term: "Apostle",
    slug: "apostle",
    category: "person",
    summary: "A sent messenger, especially one commissioned by Christ.",
    definition: "Apostle refers to one sent with authority, especially the foundational witnesses Christ appointed for the early church.",
    keyReferences: ["Luke 6:13", "Acts 1:21-26", "Ephesians 2:20"],
    relatedTerms: ["Church", "Disciple", "Gospel"],
    aliases: ["apostles"],
  },
  {
    term: "Ark of the Covenant",
    slug: "ark-of-the-covenant",
    category: "place",
    summary: "The sacred chest associated with God's covenant presence and testimony.",
    definition: "The ark held covenant testimony and symbolized God's holy presence among His people, especially in tabernacle and temple worship.",
    keyReferences: ["Exodus 25:10-22", "Joshua 3:14-17", "1 Samuel 4:3-11"],
    relatedTerms: ["Covenant", "Temple", "Holiness"],
    aliases: ["ark"],
  },
  {
    term: "Bethlehem",
    slug: "bethlehem",
    category: "place",
    summary: "The town associated with David and the birth of Jesus.",
    definition: "Bethlehem is a small but significant town in biblical history, tied both to David's story and to the birth of the Messiah.",
    keyReferences: ["1 Samuel 16:1", "Micah 5:2", "Luke 2:4-7"],
    relatedTerms: ["David", "Messiah", "Jerusalem"],
  },
  {
    term: "Canon",
    slug: "canon",
    category: "theme",
    summary: "The recognized collection of books received as Holy Scripture.",
    definition: "Canon refers to the body of writings recognized by God's people as authoritative Scripture.",
    keyReferences: ["2 Timothy 3:16-17", "2 Peter 3:15-16", "Revelation 22:18-19"],
    relatedTerms: ["Scripture", "Inspiration", "Prophet"],
  },
  {
    term: "Christ",
    slug: "christ",
    category: "theme",
    summary: "The Greek title meaning 'Anointed One,' equivalent to Messiah.",
    definition: "Christ is the title used for Jesus as the promised anointed deliverer, king, and savior.",
    keyReferences: ["Matthew 16:16", "John 20:31", "Acts 2:36"],
    relatedTerms: ["Messiah", "Kingdom of God", "Gospel"],
  },
  {
    term: "Church",
    slug: "church",
    category: "practice",
    summary: "The gathered people of God united to Christ and one another.",
    definition: "Church refers to the assembly of believers called out by God, both locally and as the universal body of Christ.",
    keyReferences: ["Matthew 16:18", "Acts 2:42-47", "Ephesians 4:11-16"],
    relatedTerms: ["Disciple", "Holy Spirit", "Body of Christ"],
    aliases: ["body of christ"],
  },
  {
    term: "Creation",
    slug: "creation",
    category: "theme",
    summary: "God's bringing all things into existence by His word and power.",
    definition: "Creation describes God's purposeful making of the heavens and the earth, establishing order, goodness, and human vocation.",
    keyReferences: ["Genesis 1", "Psalm 19:1", "Colossians 1:16"],
    relatedTerms: ["Eden", "New Creation", "Sabbath"],
  },
  {
    term: "Crucifixion",
    slug: "crucifixion",
    category: "theme",
    summary: "The death of Jesus on the cross for sinners.",
    definition: "Crucifixion refers especially to Christ's death on the cross, where He bore sin and accomplished redemption.",
    keyReferences: ["Mark 15", "John 19", "Galatians 6:14"],
    relatedTerms: ["Atonement", "Redemption", "Resurrection"],
  },
  {
    term: "Deacon",
    slug: "deacon",
    category: "person",
    summary: "A servant-leader role within the life of the church.",
    definition: "Deacon language is associated with practical service and faithful care within the church's ministry.",
    keyReferences: ["Acts 6:1-7", "Philippians 1:1", "1 Timothy 3:8-13"],
    relatedTerms: ["Church", "Elder", "Service"],
  },
  {
    term: "Elder",
    slug: "elder",
    category: "person",
    summary: "A mature overseer charged with shepherding and guarding the church.",
    definition: "Elders are spiritually qualified leaders called to guide, teach, and care for the church.",
    keyReferences: ["Acts 20:28", "1 Timothy 3:1-7", "1 Peter 5:1-4"],
    relatedTerms: ["Church", "Pastor", "Deacon"],
    aliases: ["overseer", "pastor"],
  },
  {
    term: "Forgiveness",
    slug: "forgiveness",
    category: "theme",
    summary: "The release of guilt and debt through God's mercy.",
    definition: "Forgiveness is God's gracious removal of sin's guilt and also a pattern believers are called to extend toward others.",
    keyReferences: ["Psalm 103:10-12", "Matthew 6:14-15", "Ephesians 4:32"],
    relatedTerms: ["Grace", "Repentance", "Atonement"],
  },
  {
    term: "Gentiles",
    slug: "gentiles",
    category: "person",
    summary: "The nations outside ethnic Israel.",
    definition: "Gentiles is a biblical term for the peoples of the nations distinct from Israel, though they are also included in God's saving purpose through Christ.",
    keyReferences: ["Isaiah 49:6", "Acts 10", "Ephesians 2:11-22"],
    relatedTerms: ["Israel", "Gospel", "Covenant"],
    aliases: ["nations"],
  },
  {
    term: "Glory",
    slug: "glory",
    category: "theme",
    summary: "The weight, beauty, splendor, and manifest worth of God.",
    definition: "Glory describes the majesty and radiance of God made known in His presence, character, works, and ultimately in Christ.",
    keyReferences: ["Exodus 33:18-23", "Isaiah 6:1-3", "John 1:14"],
    relatedTerms: ["Holiness", "Worship", "Kingdom of God"],
  },
  {
    term: "Holiness",
    slug: "holiness",
    category: "theme",
    summary: "God's utter purity and the set-apart life He calls His people to.",
    definition: "Holiness means separation from sin and dedication to God. It belongs perfectly to God and is progressively worked into His people.",
    keyReferences: ["Leviticus 19:2", "Isaiah 6:3", "1 Peter 1:15-16"],
    relatedTerms: ["Sanctification", "Temple", "Glory"],
  },
  {
    term: "Incarnation",
    slug: "incarnation",
    category: "theology",
    summary: "The eternal Son taking on human nature in Jesus Christ.",
    definition: "Incarnation describes the mystery that the Word became flesh without ceasing to be truly God.",
    keyReferences: ["John 1:14", "Philippians 2:5-8", "Hebrews 2:14-17"],
    relatedTerms: ["Messiah", "Trinity", "Gospel"],
  },
  {
    term: "Inspiration",
    slug: "inspiration",
    category: "theology",
    summary: "God's superintending work by which Scripture is truly His word.",
    definition: "Inspiration means Scripture is breathed out by God, carrying divine authority through human authors.",
    keyReferences: ["2 Timothy 3:16", "2 Peter 1:20-21"],
    relatedTerms: ["Canon", "Scripture", "Prophet"],
  },
  {
    term: "Law",
    slug: "law",
    category: "theme",
    summary: "God's revealed instruction, especially in the covenant life of Israel.",
    definition: "Law can refer specifically to the Mosaic law or more broadly to God's instruction, revealing both His righteousness and humanity's need.",
    keyReferences: ["Exodus 20", "Psalm 19:7-11", "Romans 7:7-12"],
    relatedTerms: ["Pentateuch", "Covenant", "Holiness"],
    aliases: ["torah"],
  },
  {
    term: "Mercy",
    slug: "mercy",
    category: "theme",
    summary: "God's compassionate withholding of deserved judgment and His tender care for the needy.",
    definition: "Mercy highlights God's pity, compassion, and readiness to help those in distress and guilt.",
    keyReferences: ["Exodus 34:6", "Luke 18:13", "Titus 3:5"],
    relatedTerms: ["Grace", "Forgiveness", "Atonement"],
  },
  {
    term: "Prophet",
    slug: "prophet",
    category: "person",
    summary: "A spokesperson through whom God reveals His word to His people.",
    definition: "Prophets call God's people to covenant faithfulness, expose sin, announce judgment, and proclaim hope.",
    keyReferences: ["Deuteronomy 18:15-19", "Jeremiah 1:4-10", "Hebrews 1:1-2"],
    relatedTerms: ["Scripture", "Covenant", "Messiah"],
  },
  {
    term: "Resurrection",
    slug: "resurrection",
    category: "theme",
    summary: "Rising from the dead, especially the bodily resurrection of Jesus and the future hope of believers.",
    definition: "Resurrection is central to Christian hope, confirming Christ's victory and promising final life for His people.",
    keyReferences: ["Matthew 28", "John 11:25-26", "1 Corinthians 15"],
    relatedTerms: ["Gospel", "Hope", "New Creation"],
  },
  {
    term: "Righteousness",
    slug: "righteousness",
    category: "theme",
    summary: "What is right, just, and in full conformity with God's character and will.",
    definition: "Righteousness refers to moral rightness, covenant faithfulness, and the standing believers receive through Christ.",
    keyReferences: ["Psalm 11:7", "Romans 1:16-17", "2 Corinthians 5:21"],
    relatedTerms: ["Justification", "Holiness", "Faith"],
  },
  {
    term: "Sacrifice",
    slug: "sacrifice",
    category: "practice",
    summary: "An offering made to God, especially in the old covenant system of worship.",
    definition: "Sacrifice in Scripture often involves offering something to God for worship, fellowship, thanksgiving, or atonement.",
    keyReferences: ["Leviticus 1", "Psalm 51:16-17", "Hebrews 10:11-14"],
    relatedTerms: ["Atonement", "Passover", "Temple"],
  },
  {
    term: "Salvation",
    slug: "salvation",
    category: "theme",
    summary: "God's rescue of sinners from judgment, sin, and death.",
    definition: "Salvation includes forgiveness, reconciliation, deliverance, and final restoration through Jesus Christ.",
    keyReferences: ["Psalm 27:1", "Ephesians 2:1-10", "Titus 3:4-7"],
    relatedTerms: ["Grace", "Redemption", "Gospel"],
  },
  {
    term: "Scripture",
    slug: "scripture",
    category: "theme",
    summary: "The sacred writings received as the word of God.",
    definition: "Scripture refers to the inspired writings that carry divine authority and are given for teaching, correction, and formation.",
    keyReferences: ["Luke 24:27", "John 10:35", "2 Timothy 3:16-17"],
    relatedTerms: ["Canon", "Inspiration", "Prophet"],
    aliases: ["word of god"],
  },
  {
    term: "Sheol",
    slug: "sheol",
    category: "theme",
    summary: "An Old Testament term associated with the realm of the dead.",
    definition: "Sheol is an Old Testament word used for the grave or the place of the dead, often with poetic and theological nuance.",
    keyReferences: ["Psalm 16:10", "Psalm 88:3-5", "Proverbs 15:24"],
    relatedTerms: ["Death", "Hope", "Resurrection"],
  },
  {
    term: "Sin",
    slug: "sin",
    category: "theme",
    summary: "Rebellion against God, falling short of His glory and will.",
    definition: "Sin includes wrong actions, corrupted desires, and failure to love God and neighbor as one should.",
    keyReferences: ["Genesis 3", "Psalm 51:1-4", "Romans 3:23"],
    relatedTerms: ["Repentance", "Atonement", "Grace"],
  },
  {
    term: "Tabernacle",
    slug: "tabernacle",
    category: "place",
    summary: "Israel's portable sanctuary before the temple was built.",
    definition: "The tabernacle was the tented meeting place where God dwelt among His people and where sacrificial worship was carried out.",
    keyReferences: ["Exodus 25:8-9", "Exodus 40:34-38", "Hebrews 9:1-9"],
    relatedTerms: ["Temple", "Ark of the Covenant", "Atonement"],
  },
  {
    term: "Wilderness",
    slug: "wilderness",
    category: "place",
    summary: "A place of testing, dependence, formation, and divine provision.",
    definition: "The wilderness in Scripture is both geographic and symbolic, often associated with trial, repentance, preparation, and God's sustaining care.",
    keyReferences: ["Deuteronomy 8:2-3", "Isaiah 40:3", "Matthew 4:1-11"],
    relatedTerms: ["Exodus", "Faith", "Repentance"],
  },
  {
    term: "Worship",
    slug: "worship",
    category: "practice",
    summary: "The honor, love, reverence, and obedience offered to God.",
    definition: "Worship includes praise, prayer, sacrifice, obedience, and whole-life devotion directed toward God alone.",
    keyReferences: ["Psalm 95:1-7", "John 4:23-24", "Romans 12:1"],
    relatedTerms: ["Glory", "Temple", "Prayer"],
  },
];

export const biblicalDictionaryEntries: BiblicalDictionaryEntry[] = [
  ...coreBiblicalDictionaryEntries,
  ...supplementalBiblicalDictionaryEntries,
];

export const sortedBiblicalDictionaryEntries = [...biblicalDictionaryEntries].sort((left, right) =>
  left.term.localeCompare(right.term),
);

export function getBiblicalDictionaryEntryBySlug(slug: string) {
  return sortedBiblicalDictionaryEntries.find((entry) => entry.slug === slug) ?? null;
}

export function findBiblicalDictionaryEntry(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return null;
  }

  return (
    sortedBiblicalDictionaryEntries.find(
      (entry) => entry.term.toLowerCase() === normalizedQuery,
    ) ??
    sortedBiblicalDictionaryEntries.find(
      (entry) => (entry.aliases ?? []).some((alias) => alias.toLowerCase() === normalizedQuery),
    ) ??
    sortedBiblicalDictionaryEntries.find(
      (entry) =>
        entry.term.toLowerCase().includes(normalizedQuery) ||
        entry.summary.toLowerCase().includes(normalizedQuery) ||
        entry.definition.toLowerCase().includes(normalizedQuery) ||
        entry.relatedTerms.some((term) => term.toLowerCase().includes(normalizedQuery)) ||
        (entry.aliases ?? []).some((alias) => alias.toLowerCase().includes(normalizedQuery)),
    ) ??
    null
  );
}

export function getRelatedDictionaryEntries(entry: BiblicalDictionaryEntry, limit = 3) {
  return sortedBiblicalDictionaryEntries
    .filter((candidate) => candidate.slug !== entry.slug)
    .filter(
      (candidate) =>
        candidate.category === entry.category ||
        candidate.relatedTerms.some((term) => term === entry.term) ||
        entry.relatedTerms.some((term) => term === candidate.term),
    )
    .slice(0, limit);
}

const dictionarySuggestionsByReference: Record<string, string[]> = {
  "John 3:16": ["gospel", "faith", "grace"],
  "Romans 8:28": ["hope", "faith", "sanctification"],
  "Psalm 119:105": ["scripture", "holiness", "worship"],
};

export function getSuggestedDictionaryEntries(reference: string, limit = 3) {
  const direct = dictionarySuggestionsByReference[reference] ?? [];
  const slugs = direct.length > 0 ? direct : ["gospel", "grace", "faith"];

  return slugs
    .map((slug) => getBiblicalDictionaryEntryBySlug(slug))
    .filter((entry): entry is BiblicalDictionaryEntry => Boolean(entry))
    .slice(0, limit);
}
