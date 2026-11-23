"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMarkdownComponents } from "@/components/common/MarkdownContent";

interface ProductDescriptionMarkdownProps {
  content: string;
}

export default function ProductDescriptionMarkdown({ content }: ProductDescriptionMarkdownProps) {
  const markdownComponents = useMarkdownComponents();

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </Markdown>
  );
}
