import React from "react";

export default function ApologeticsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Christian Apologetics</h1>
      <p className="mb-8 text-lg text-slate-700 dark:text-slate-300">
        Welcome to the Apologetics resource center. Here you'll find articles,
        recommended resources, and answers to common questions about the
        Christian faith.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Featured Articles</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Is There Evidence for the Resurrection?
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              How Can We Trust the Bible?
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Does Science Contradict Christianity?
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Recommended Resources</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a
              href="https://www.reasonablefaith.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Reasonable Faith (William Lane Craig)
            </a>
          </li>
          <li>
            <a
              href="https://www.crossexamined.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Cross Examined (Frank Turek)
            </a>
          </li>
          <li>
            <a
              href="https://www.rzim.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              RZIM
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-slate-100 dark:bg-slate-800 rounded p-4">
            <summary className="font-medium cursor-pointer">
              What is apologetics?
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Apologetics is the reasoned defense of the Christian faith,
              addressing questions and objections with evidence and logic.
            </p>
          </details>
          <details className="bg-slate-100 dark:bg-slate-800 rounded p-4">
            <summary className="font-medium cursor-pointer">
              Can faith and science coexist?
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Many Christians believe that faith and science are complementary,
              not contradictory, and that scientific discoveries can support
              belief in God.
            </p>
          </details>
          <details className="bg-slate-100 dark:bg-slate-800 rounded p-4">
            <summary className="font-medium cursor-pointer">
              How do I answer tough questions from skeptics?
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Start by listening respectfully, understanding the question, and
              responding with humility, evidence, and personal experience.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
