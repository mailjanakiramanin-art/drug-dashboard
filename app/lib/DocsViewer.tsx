"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export interface DocFile {
  name: string;
  content: string;
}

interface DocsViewerProps {
  docs: DocFile[];
}

export default function DocsViewer({ docs }: DocsViewerProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex">
      {/* sidebar */}
      <nav className="w-64 shrink-0 bg-gray-100 p-6 sticky top-0 h-screen overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Documentation</h3>
        <ul className="space-y-2">
          {docs.map((doc, idx) => {
            const isActive = idx === selected;
            return (
              <li key={doc.name}>
                <button
                  onClick={() => setSelected(idx)}
                  className={`block w-full text-left px-2 py-1 rounded transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {doc.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* panel area */}
      <div className="prose flex-1 max-w-none p-8">
        <article>
          <h2 className="text-2xl font-bold mb-4">{docs[selected].name}</h2>
          <ReactMarkdown>{docs[selected].content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}