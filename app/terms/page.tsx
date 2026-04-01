import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for using Christian Study Guide, including acceptable use, content, accounts, and limitation of liability.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing or using Christian Study Guide, you agree to these Terms and Conditions. If you do not agree, please do not use the website or any related services.",
  },
  {
    title: "Use of the Website",
    body:
      "You may use this website for personal, educational, ministry, and non-commercial study purposes. You agree not to misuse the site, interfere with its operation, attempt unauthorized access, or use the service in a way that harms other users.",
  },
  {
    title: "Accounts and User Content",
    body:
      "If you create an account, you are responsible for the information you provide and for keeping your login credentials secure. Notes, prayer requests, bookmarks, and other saved content you submit remain your responsibility, and you agree not to post unlawful, abusive, or infringing material.",
  },
  {
    title: "Content and Accuracy",
    body:
      "Christian Study Guide is intended to support Bible reading, reflection, and spiritual growth. While we aim to provide helpful and accurate content, we do not guarantee that every feature, commentary, devotional, or reference is complete, error-free, or suitable for every theological tradition or personal circumstance.",
  },
  {
    title: "Acceptable Community Use",
    body:
      "If you use community features such as groups, prayer sharing, or public submissions, you agree to interact respectfully and lawfully. We may remove content or restrict access if material is abusive, deceptive, unlawful, spammy, or inconsistent with the intended purpose of the site.",
  },
  {
    title: "Intellectual Property",
    body:
      "The design, branding, original written materials, and site features of Christian Study Guide are protected by applicable intellectual property laws. Scripture text, third-party tools, and external resources may be subject to their own licenses, rights, and attribution requirements.",
  },
  {
    title: "Third-Party Services",
    body:
      "The website may rely on third-party providers for hosting, authentication, analytics, email delivery, and related infrastructure. We are not responsible for outages, changes, or policies introduced by those third-party services.",
  },
  {
    title: "Disclaimer",
    body:
      "This website is provided on an 'as is' and 'as available' basis without warranties of any kind, express or implied. Nothing on the site constitutes legal, medical, financial, or professional advice.",
  },
  {
    title: "Limitation of Liability",
    body:
      "To the fullest extent permitted by law, Christian Study Guide and its operators will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the website.",
  },
  {
    title: "Changes to These Terms",
    body:
      "We may update these Terms and Conditions from time to time. Continued use of the site after changes become effective constitutes acceptance of the updated terms.",
  },
  {
    title: "Contact",
    body:
      "Questions about these Terms and Conditions may be directed through the contact information or support channel associated with this website.",
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Legal</p>
        <h1>Terms and Conditions</h1>
        <p className="content-lead">
          These terms explain the basic rules, responsibilities, and limits that
          apply when using Christian Study Guide.
        </p>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-card-note">
          <strong>Effective date</strong>
          <p>April 1, 2026</p>
        </div>

        {sections.map((section) => (
          <article key={section.title} className="content-card">
            <h2 className="content-card-title">{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
