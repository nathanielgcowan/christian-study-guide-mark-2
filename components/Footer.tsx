import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/site-map", label: "Site Map" },
  { href: "/bible", label: "Bible" },
  { href: "/blog", label: "Blog" },
  { href: "/search", label: "Search" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-copy">
          <p className="eyebrow">Christian Study Guide</p>
          <h2>A rebuilt home for reading, prayer, and steady spiritual growth.</h2>
          <p>
            Created to make daily study feel grounded, welcoming, and easier to
            return to.
          </p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="site-footer-meta">
        <span>&copy; {new Date().getFullYear()} Christian Study Guide</span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
