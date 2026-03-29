"use client";
import dynamic from "next/dynamic";

const BibleTranslations = dynamic(
  () => import("../components/BibleTranslations"),
  { ssr: false }
);
const BibleSearch = dynamic(
  () => import("../components/BibleSearch"),
  { ssr: false }
);

export default function BibleClientWidgets() {
  return (
    <>
      <BibleTranslations />
      <BibleSearch />
    </>
  );
}
