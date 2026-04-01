import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Christian Study Guide, including what information may be collected, how it may be used, and your choices regarding personal data.",
};

const sections = [
  {
    title: "Overview",
    body:
      "Christian Study Guide is designed to support Bible reading, study, prayer, and spiritual growth. This Privacy Policy explains what information may be collected when you use the site, how that information may be used, and the choices you may have regarding your data.",
  },
  {
    title: "Information You Provide",
    body:
      "If you create an account or use interactive features, you may provide information such as your name, email address, profile details, study notes, bookmarks, prayer requests, and other content you choose to save or submit.",
  },
  {
    title: "Information Collected Automatically",
    body:
      "The website may collect limited technical and usage information such as browser type, device information, pages visited, interaction patterns, and referral information. This may be used to operate, secure, and improve the site.",
  },
  {
    title: "How Information May Be Used",
    body:
      "Information may be used to provide account access, save study activity, personalize the dashboard and reading experience, improve features, respond to user actions, maintain security, and understand how the website is being used.",
  },
  {
    title: "Analytics and Measurement",
    body:
      "The site may use analytics tools, including third-party analytics services, to understand general traffic and feature usage. These tools may collect device, page, and interaction data according to their own technologies and policies.",
  },
  {
    title: "Cookies and Similar Technologies",
    body:
      "Cookies or similar storage technologies may be used to keep users signed in, remember preferences, support analytics, and improve site functionality. Depending on your browser and device settings, you may be able to control or restrict some of this behavior.",
  },
  {
    title: "User Content and Visibility",
    body:
      "Some content you create, such as prayer requests or community submissions, may be visible to others if you choose to share it publicly or within group features. Please use discretion when sharing personal or sensitive information.",
  },
  {
    title: "Third-Party Services",
    body:
      "Christian Study Guide may rely on third-party providers for hosting, authentication, analytics, infrastructure, and related services. Those providers may process data as needed to deliver their services, subject to their own terms and privacy practices.",
  },
  {
    title: "Data Retention",
    body:
      "Information may be retained for as long as needed to provide the service, maintain records, improve the product, comply with legal obligations, or resolve disputes. Retention periods may vary depending on the type of data involved.",
  },
  {
    title: "Security",
    body:
      "Reasonable steps may be taken to protect personal information, but no website or online service can guarantee absolute security. You should also take reasonable care with your own credentials and account access.",
  },
  {
    title: "Children's Privacy",
    body:
      "The website is not intended for unsupervised use by children where prohibited by law. If you believe personal information has been provided improperly, please use the appropriate contact or support channel associated with the site.",
  },
  {
    title: "Changes to This Policy",
    body:
      "This Privacy Policy may be updated from time to time. Continued use of the website after updates become effective means the revised policy will apply going forward.",
  },
  {
    title: "Contact",
    body:
      "Questions about this Privacy Policy may be directed through the contact information or support channel associated with Christian Study Guide.",
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="content-lead">
          This policy outlines what information may be collected through Christian
          Study Guide and how that information may be used.
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
