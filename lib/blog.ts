export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readingTime: string;
  relatedHref: string;
  relatedLabel: string;
  intro: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  closing: string[];
};

type BlogSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  relatedHref: string;
  relatedLabel: string;
  focus: string;
  tension: string;
  invitation: string;
  practices: string[];
};

function createGuidedPost(seed: BlogSeed): BlogPost {
  return {
    slug: seed.slug,
    title: seed.title,
    excerpt: seed.excerpt,
    category: seed.category,
    date: seed.date,
    author: "Christian Study Guide Team",
    readingTime: "5 min read",
    relatedHref: seed.relatedHref,
    relatedLabel: seed.relatedLabel,
    intro: [
      `${seed.focus} often feels more complicated in real life than it does in a sermon outline or a short social post.`,
      `Many believers live with ${seed.tension}. A healthier response starts with honesty, patience, and a clearer sense of how discipleship actually grows.`,
    ],
    sections: [
      {
        heading: "Why this matters",
        paragraphs: [
          `${seed.focus} shapes more than one moment. It affects attention, relationships, habits, and the way a person imagines God meeting them in daily life.`,
          `When this area is ignored or reduced to clichés, people can feel stuck, ashamed, or spiritually numb without knowing how to move forward.`,
        ],
      },
      {
        heading: "Common drift to avoid",
        paragraphs: [
          "One common mistake is swinging between pressure and passivity. Either we demand instant maturity from ourselves, or we assume slow growth means nothing is changing.",
          `${seed.tension} can make that cycle even worse because people begin reacting to frustration instead of receiving discipleship with steadiness.`,
        ],
      },
      {
        heading: "A steadier way forward",
        paragraphs: [
          `Scripture usually forms people through repeated patterns of grace, truth, confession, and practice. ${seed.invitation}`,
          "That kind of growth is often quieter than people expect, but it is usually more durable because it reaches the heart instead of only managing appearances.",
        ],
        bullets: seed.practices,
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Choose one faithful response and stay with it long enough to notice what God is doing through repetition.",
          "The goal is not impressive performance. It is durable obedience shaped by grace, clarity, and a realistic understanding of how change happens.",
        ],
      },
    ],
    closing: [
      `${seed.focus} becomes more sustainable when it is rooted in grace instead of panic.`,
      "That is why the church needs language that is both honest about struggle and hopeful about growth in Christ.",
    ],
  };
}

const guidedPosts: BlogPost[] = [
  createGuidedPost({
    slug: "when-prayer-feels-dry-and-repetitive",
    title: "When prayer feels dry and repetitive",
    excerpt:
      "A practical reflection on spiritual dryness, repeated prayers, and how faithfulness often grows quietly.",
    category: "Prayer",
    date: "March 27, 2026",
    relatedHref: "/prayer",
    relatedLabel: "Open the Prayer page",
    focus: "Prayer",
    tension:
      "disappointment, distraction, and the fear that repeated prayers no longer mean anything",
    invitation:
      "The invitation is not to manufacture emotion, but to keep showing up before God with truth and dependence.",
    practices: [
      "Pray one Psalm each day for a week.",
      "Use the same short prayer prompt morning and evening.",
      "Write down one honest request and one reason for gratitude.",
    ],
  }),
  // ... (other guidedPosts omitted for brevity)
];

const featuredPosts: BlogPost[] = [
  {
    slug: "rethinking-purity-culture-with-truth-grace-and-discipleship",
    title: "Rethinking purity culture with truth, grace, and discipleship",
    excerpt:
      "A pastoral reflection on sexual integrity, shame, healing, and why discipleship has to be deeper than fear-based messaging.",
    category: "Discipleship",
    date: "March 28, 2026",
    author: "Christian Study Guide Team",
    readingTime: "7 min read",
    relatedHref: "/theology",
    relatedLabel: "Explore theology and formation topics",
    intro: [
      "Many Christians use the phrase purity culture to describe a set of messages about sex, holiness, dating, modesty, and worth that shaped churches, youth ministries, and families for years.",
      "Some of those messages came from a sincere desire to honor God. But in many settings, the result was a culture driven more by fear, shame, and image management than by mature discipleship in Christ.",
    ],
    sections: [
      {
        heading: "The problem was not calling people to holiness",
        paragraphs: [
          "Scripture does call believers to holiness, self-control, and sexual integrity. The problem was often not the existence of moral conviction, but the way conviction was framed and enforced.",
          "When holiness is reduced to rule-keeping, external performance, or a narrow focus on virginity, people can learn to manage appearances without learning how desire, repentance, grace, and sanctification actually work.",
        ],
      },
      // ... (other sections omitted for brevity)
    ],
    closing: [
      "The answer to harmful purity culture is not abandoning holiness. It is recovering a more biblical, more honest, and more grace-filled vision of holiness in Christ.",
      "When churches tell the truth about sin and the truth about grace at the same time, people have a better chance of finding both conviction and healing.",
    ],
  },
  // ... (other featuredPosts omitted for brevity)
];

export const blogPosts: BlogPost[] = [...featuredPosts, ...guidedPosts];

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
