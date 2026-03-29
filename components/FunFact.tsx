import React from "react";

export default function FunFact() {
  const facts = [
    "The Bible is the best-selling book of all time.",
    "There are 66 books in the Protestant Bible.",
    "Psalm 119 is the longest chapter in the Bible.",
    "Jesus wept is the shortest verse in the Bible (John 11:35).",
    "The word 'Christian' appears only three times in the New Testament.",
  ];
  const [fact, setFact] = React.useState(facts[0]);

  function randomFact() {
    const idx = Math.floor(Math.random() * facts.length);
    setFact(facts[idx]);
  }

  return (
    <div
      style={{
        padding: 16,
        background: "#f9fafb",
        borderRadius: 8,
        margin: "16px 0",
        textAlign: "center",
      }}
    >
      <h3>Did you know?</h3>
      <p>{fact}</p>
      <button onClick={randomFact} style={{ marginTop: 8 }}>
        Show another fact
      </button>
    </div>
  );
}
