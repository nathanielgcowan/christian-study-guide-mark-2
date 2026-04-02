export interface ExportNoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  updatedAt: string;
  tags: string[];
}

export interface ExportPrayerEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: string;
  answered: boolean;
  answeredDate?: string;
}

export interface ExportCollectionItem {
  reference: string;
  href: string;
  addedAt: string;
}

export interface ExportCollection {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  items: ExportCollectionItem[];
}

type ExportSectionConfig = {
  title: string;
  summary: string;
  body: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateLabel(value?: string) {
  if (!value) return "Unknown date";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

function buildTextExport(title: string, sections: ExportSectionConfig[]) {
  const header = [
    "Christian Study Guide Export",
    title,
    `Generated ${new Date().toLocaleString()}`,
    "",
  ];

  const body = sections.flatMap((section) => [
    section.title.toUpperCase(),
    section.summary,
    "",
    ...section.body,
    "",
  ]);

  return [...header, ...body].join("\n");
}

function buildPrintableHtml(title: string, sections: ExportSectionConfig[]) {
  const renderedSections = sections
    .map(
      (section) => `
        <section class="export-section">
          <h2>${escapeHtml(section.title)}</h2>
          <p class="export-summary">${escapeHtml(section.summary)}</p>
          ${section.body
            .map((item) => `<p>${escapeHtml(item).replaceAll("\n", "<br />")}</p>`)
            .join("")}
        </section>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        font-family: Georgia, serif;
        color: #141414;
        margin: 40px;
        line-height: 1.65;
      }
      h1, h2 {
        line-height: 1.2;
      }
      h1 {
        margin-bottom: 0.4rem;
      }
      .meta {
        color: #5b564a;
        margin-bottom: 2rem;
      }
      .export-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #d7d0c0;
      }
      .export-summary {
        font-style: italic;
        color: #4c473e;
      }
      @media print {
        body {
          margin: 18mm;
        }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">Generated ${escapeHtml(new Date().toLocaleString())}</p>
    ${renderedSections}
  </body>
</html>`;
}

function downloadBlob(filename: string, content: string, type: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function openPrintWindow(title: string, html: string) {
  if (typeof window === "undefined") return;
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.title = title;
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 250);
}

function buildNotesSections(notes: ExportNoteItem[]): ExportSectionConfig[] {
  return [
    {
      title: "Notes",
      summary: `${notes.length} saved note${notes.length === 1 ? "" : "s"} from your study workspace.`,
      body:
        notes.length > 0
          ? notes.map(
              (note) =>
                `${note.reference}\nType: ${note.noteType}\nUpdated: ${formatDateLabel(note.updatedAt)}${
                  note.tags.length > 0 ? `\nTags: ${note.tags.join(", ")}` : ""
                }\n\n${note.content}`,
            )
          : ["No saved notes were available at export time."],
    },
  ];
}

function buildPrayerSections(entries: ExportPrayerEntry[]): ExportSectionConfig[] {
  return [
    {
      title: "Prayer Journal",
      summary: `${entries.length} prayer entr${entries.length === 1 ? "y" : "ies"} including answered and ongoing requests.`,
      body:
        entries.length > 0
          ? entries.map(
              (entry) =>
                `${entry.title}\nDate: ${formatDateLabel(entry.date)}\nCategory: ${entry.category}\nStatus: ${
                  entry.answered
                    ? `Answered${entry.answeredDate ? ` on ${formatDateLabel(entry.answeredDate)}` : ""}`
                    : "Waiting"
                }\n\n${entry.content}`,
            )
          : ["No prayer journal entries were available at export time."],
    },
  ];
}

function buildCollectionSections(collections: ExportCollection[]): ExportSectionConfig[] {
  return collections.length > 0
    ? collections.map((collection) => ({
        title: collection.name,
        summary:
          collection.description || `${collection.items.length} saved reference${collection.items.length === 1 ? "" : "s"}.`,
        body:
          collection.items.length > 0
            ? collection.items.map(
                (item) =>
                  `${item.reference}\nSaved: ${formatDateLabel(item.addedAt)}\nLink: ${item.href}`,
              )
            : ["No passages have been saved into this collection yet."],
      }))
    : [
        {
          title: "Study Collections",
          summary: "No study collections were available at export time.",
          body: ["Create or save passages into a collection before exporting."],
        },
      ];
}

export function exportNotesAsText(notes: ExportNoteItem[]) {
  downloadBlob(
    "csg-notes.txt",
    buildTextExport("Study Notes Export", buildNotesSections(notes)),
    "text/plain;charset=utf-8",
  );
}

export function exportPrayerJournalAsText(entries: ExportPrayerEntry[]) {
  downloadBlob(
    "csg-prayer-journal.txt",
    buildTextExport("Prayer Journal Export", buildPrayerSections(entries)),
    "text/plain;charset=utf-8",
  );
}

export function exportCollectionsAsText(collections: ExportCollection[]) {
  downloadBlob(
    "csg-collections.txt",
    buildTextExport("Study Collections Export", buildCollectionSections(collections)),
    "text/plain;charset=utf-8",
  );
}

export function exportNotesAsPdf(notes: ExportNoteItem[]) {
  openPrintWindow(
    "Study Notes Export",
    buildPrintableHtml("Study Notes Export", buildNotesSections(notes)),
  );
}

export function exportPrayerJournalAsPdf(entries: ExportPrayerEntry[]) {
  openPrintWindow(
    "Prayer Journal Export",
    buildPrintableHtml("Prayer Journal Export", buildPrayerSections(entries)),
  );
}

export function exportCollectionsAsPdf(collections: ExportCollection[]) {
  openPrintWindow(
    "Study Collections Export",
    buildPrintableHtml("Study Collections Export", buildCollectionSections(collections)),
  );
}
