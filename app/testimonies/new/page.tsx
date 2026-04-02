import NewTestimonyClient from "./NewTestimonyClient";

export default async function NewTestimonyPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const params = await searchParams;

  return <NewTestimonyClient draftId={params.draft} />;
}
