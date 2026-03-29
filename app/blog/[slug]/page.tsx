import Link from "next/link";
import { notFound } from "next/navigation";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Christian Study Guide
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Blog
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const posts = {
  "understanding-the-gospel": {
    title: "Understanding the Gospel: The Good News of Jesus Christ",
    date: "March 28, 2026",
    content: `
<h1>Understanding the Gospel: The Good News of Jesus Christ</h1>

<p>The gospel, or "good news," is the central message of Christianity. It tells the story of God's love for humanity and His plan to redeem us through Jesus Christ.</p>

<h2>What is the Gospel?</h2>

<p>The word "gospel" comes from the Greek word <em>euangelion</em>, meaning "good news" or "good tidings." In the Bible, it refers to the announcement of God's kingdom and the salvation brought through Jesus Christ.</p>

<h2>The Core Elements of the Gospel</h2>

<h3>1. God's Creation</h3>
<p>In the beginning, God created everything good (Genesis 1:31). He made humanity in His image to have a relationship with Him.</p>

<h3>2. The Problem of Sin</h3>
<p>Sin entered the world through Adam and Eve's disobedience (Genesis 3). This broke our relationship with God and introduced death and suffering into the world.</p>

<h3>3. God's Promise</h3>
<p>Throughout the Old Testament, God promised to send a Savior who would restore the relationship between God and humanity.</p>

<h3>4. Jesus Christ - The Fulfillment</h3>
<p>Jesus is the promised Messiah. He lived a perfect life, died on the cross for our sins, and rose again on the third day.</p>

<h3>5. Salvation Through Faith</h3>
<p>We are saved by grace through faith in Jesus Christ (Ephesians 2:8-9). It's not by our works, but by trusting in what Jesus has done for us.</p>

<h2>Why is the Gospel Good News?</h2>

<p>The gospel is good news because:</p>
<ul>
<li><strong>Forgiveness</strong>: Our sins are forgiven through Jesus' sacrifice</li>
<li><strong>Reconciliation</strong>: We can have a restored relationship with God</li>
<li><strong>Eternal Life</strong>: We have hope of life after death</li>
<li><strong>Purpose</strong>: We have meaning and direction in life</li>
<li><strong>Hope</strong>: We have assurance of God's love and care</li>
</ul>

<h2>Living Out the Gospel</h2>

<p>Once we accept the gospel, we're called to:</p>
<ol>
<li><strong>Follow Jesus</strong> as Lord and Savior</li>
<li><strong>Share the good news</strong> with others</li>
<li><strong>Live transformed lives</strong> that reflect God's character</li>
<li><strong>Love God and love others</strong> as Jesus commanded</li>
</ol>

<h2>Key Bible Verses About the Gospel</h2>

<blockquote>
<p>"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." - John 3:16</p>
</blockquote>

<blockquote>
<p>"Because, if you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved." - Romans 10:9</p>
</blockquote>

<blockquote>
<p>"For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord." - Romans 6:23</p>
</blockquote>

<p>The gospel is not just information—it's the power of God for salvation to everyone who believes (Romans 1:16). It's the foundation of our faith and the source of our hope.</p>
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <article className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-block rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-100 mb-6"
          >
            ← Back to Blog
          </Link>
          <time className="text-sm text-slate-500">{post.date}</time>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            {post.title}
          </h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br>"),
            }}
          />
        </div>
      </article>
    </main>
  );
}
