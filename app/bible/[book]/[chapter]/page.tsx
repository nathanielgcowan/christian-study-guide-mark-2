import BibleReaderClient from "../../BibleReaderClient";

export default async function BibleChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book, chapter } = await params;

  return (
    <BibleReaderClient
      initialBook={decodeURIComponent(book)}
      initialChapter={Number(chapter)}
    />
  );
}
