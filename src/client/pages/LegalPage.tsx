import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LegalPage(props: { title: string; markdown: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="ambient-depth glass-panel glass-panel-lg">
        <div className="label-premium">Legal</div>
        <h1 className="heading-premium mt-3">{props.title}</h1>
        <div className="prose-luxury mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {props.markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
