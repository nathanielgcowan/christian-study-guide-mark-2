export default function AccessibilityPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero accessibility-hero">
        <p className="eyebrow">Accessibility</p>
        <h1>Accessibility support is part of the site, not an afterthought.</h1>
        <p className="content-lead">
          The site is being shaped to work more clearly with keyboards,
          screen readers, zoomed layouts, reduced motion preferences, and
          calmer reading surfaces across desktop and mobile.
        </p>
      </section>

      <section className="content-grid-three">
        <article className="content-card accessibility-stat">
          <h2>Keyboard access</h2>
          <p>Skip links, visible focus states, and navigable controls.</p>
        </article>
        <article className="content-card accessibility-stat">
          <h2>Readable layouts</h2>
          <p>Cleaner spacing, responsive content width, and calmer typography.</p>
        </article>
        <article className="content-card accessibility-stat">
          <h2>Motion aware</h2>
          <p>Animation and scrolling reduce when the user asks for less motion.</p>
        </article>
      </section>

      <section className="accessibility-grid">
        <article className="content-card content-stack accessibility-card">
          <div className="content-section-heading">
            <p className="eyebrow">Current support</p>
            <h2>Accessibility features available now</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Skip navigation</strong>
              <p>
                A skip link helps keyboard and screen reader users jump straight
                to main content.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Visible focus states</strong>
              <p>
                Shared buttons, links, form fields, and interactive cards now
                receive clearer focus treatment.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Reduced motion support</strong>
              <p>
                Smooth scrolling and decorative transitions scale back when
                reduced motion is preferred.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Responsive reading surfaces</strong>
              <p>
                Major pages are designed to reflow for smaller screens and
                larger zoom levels without losing access to key actions.
              </p>
            </div>
          </div>
        </article>

        <article className="content-card content-stack accessibility-card">
          <div className="content-section-heading">
            <p className="eyebrow">Ongoing work</p>
            <h2>Areas still being improved</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Contrast review</strong>
              <p>
                We are continuing to check contrast combinations across the
                newer visual system and image-heavy pages.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Screen reader polish</strong>
              <p>
                Complex tools like the verse generator and Bible study surfaces
                still benefit from deeper labeling and usage testing.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Form and status messaging</strong>
              <p>
                Some interactive flows still need more explicit live-region and
                validation support.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="content-card accessibility-note">
        <div className="content-section-heading">
          <p className="eyebrow">Help us improve</p>
          <h2>Accessibility feedback is welcome</h2>
        </div>
        <p className="content-card-note">
          If a page, control, or reading flow is difficult to use with a keyboard,
          screen reader, magnification, or reduced-motion preference, that should
          be treated as a product issue worth fixing.
        </p>
      </section>
    </main>
  );
}
