import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ImageIcon from "@mui/icons-material/Image";
import React, { useState } from "react";
import { useToast } from "@/context/toast-context";
import { tokens } from "@/theme/theme";

const CodeBlock = ({ className, children }: any) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const codeText = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "code";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative group mb-6 rounded-2xl overflow-hidden border border-muted/50 bg-linear-to-br from-muted/50 to-muted/30 backdrop-blur-sm shadow transition-all duration-300'>
      {/* Language badge */}
      <div className='absolute top-3 left-4 z-10'>
        <span className='text-xs font-mono font-semibold text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-muted/50'>
          {language}
        </span>
      </div>

      {/* Code */}
      <div className='p-2 pt-14 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
        <pre className='m-0 p-4 rounded-xl bg-transparent font-mono text-sm leading-relaxed text-foreground/90'>
          <code
            className='whitespace-pre'
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          >
            {codeText}
          </code>
        </pre>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className='absolute top-3 right-3 bg-gray-200 dark:bg-muted-foreground/20 hover:bg-background backdrop-blur-sm border border-muted/50 text-foreground px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer'
      >
        {copied ? (
          <>
            <CheckIcon sx={{ fontSize: 14, color: tokens.primary }} />
            <span style={{ color: tokens.primary }}>Copied!</span>
          </>
        ) : (
          <>
            <ContentCopyIcon sx={{ fontSize: 14 }} />
            Copy
          </>
        )}
      </button>
    </div>
  );
};

export const useMarkdownComponents = () => {
  return {
    // Headings
    h1: ({ ...props }: any) => <h1 className='text-3xl md:text-4xl font-black tracking-tight mb-6 text-foreground' {...props} />,
    h2: ({ ...props }: any) => <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight mt-10 mb-4 text-foreground' {...props} />,
    h3: ({ ...props }: any) => <h3 className='text-xl md:text-2xl font-bold mt-8 mb-3 text-foreground' {...props} />,
    h4: ({ ...props }: any) => <h4 className='text-lg md:text-xl font-bold mt-6 mb-3 text-foreground' {...props} />,
    h5: ({ ...props }: any) => <h5 className='text-base md:text-lg font-semibold mt-5 mb-2 text-foreground' {...props} />,
    h6: ({ ...props }: any) => <h6 className='text-sm md:text-base font-semibold mt-4 mb-2 text-foreground' {...props} />,

    // Paragraph
    p: ({ node, children, ...props }: any) => {
      // keep behavior: if paragraph only contains a code element, return children directly
      if (node.children?.length === 1 && node.children[0].type === "element" && node.children[0].tagName === "code") {
        return <>{children}</>;
      }

      return (
        <p className='text-foreground/80 leading-relaxed mb-6 text-base' {...props}>
          {children}
        </p>
      );
    },

    // Link
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        className='group inline-flex items-center gap-1 text-primary font-semibold underline-offset-4 hover:underline transition'
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
        {href?.startsWith("http") && <OpenInNewIcon sx={{ fontSize: 14, opacity: 0.6 }} />}
      </a>
    ),

    // Lists
    ul: ({ ...props }: any) => <ul className='space-y-2 mb-6 pl-6' {...props} />,
    ol: ({ ...props }: any) => <ol className='space-y-2 mb-6 pl-6' {...props} />,
    li: ({ children, ...props }: any) => (
      <li
        className='text-foreground/80 leading-relaxed relative pl-2 before:absolute before:-left-4 before:content-["→"] before:text-primary/60 before:font-bold'
        {...props}
      >
        {children}
      </li>
    ),

    // Blockquote (INFO/WARNING/ERROR/TIPS)
    blockquote: ({ children, ...props }: any) => {
      const textContent = React.Children.toArray(children)
        .map((child: any) => {
          if (typeof child === "string") return child;
          if (child.props?.children) return child.props.children;
          return "";
        })
        .join(" ");

      const match = textContent.match(/^([A-Z]+):\s*/);
      const type = match ? match[1] : "INFO";
      const content = match ? textContent.replace(`${type}: `, "") : textContent;

      const typeClasses: Record<string, string> = {
        INFO: "bg-blue-100 border-blue-500 text-blue-800",
        WARNING: "bg-yellow-100 border-yellow-500 text-yellow-800",
        ERROR: "bg-red-100 border-red-500 text-red-800",
        TIPS: "bg-green-100 border-green-500 text-green-800",
      };

      return (
        <div className={`border-l-4 p-4 mb-4 italic ${typeClasses[type] || typeClasses.INFO}`} {...props}>
          {content}
        </div>
      );
    },

    // Code
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className='bg-muted/60 border border-muted rounded-md px-2 py-0.5 text-sm font-mono text-foreground/90 font-semibold'
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },

    // HR
    hr: ({ ...props }: any) => <hr className='border-0 h-px bg-linear-to-r from-transparent via-muted to-transparent my-12' {...props} />,

    // Tables
    table: ({ ...props }: any) => (
      <div className='overflow-x-auto mb-8 rounded-xl border border-muted/50 shadow'>
        <table className='w-full border-collapse bg-background/50 backdrop-blur-sm' {...props} />
      </div>
    ),
    thead: ({ ...props }: any) => <thead className='bg-linear-to-r from-muted/80 to-muted/40 backdrop-blur-sm' {...props} />,
    th: ({ ...props }: any) => (
      <th className='border-b border-muted px-6 py-4 text-left font-bold text-foreground text-sm uppercase tracking-wide' {...props} />
    ),
    td: ({ ...props }: any) => <td className='border-b border-muted/30 px-6 py-4 text-foreground/80' {...props} />,

    // Images
    img: ({ src, alt, ...props }: any) => (
      <div className='group relative my-8 rounded-2xl overflow-hidden border border-muted/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
        <img
          src={src}
          alt={alt}
          className='w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105'
          {...props}
        />
        {alt && (
          <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <p className='text-white text-sm flex items-center gap-2'>
              <ImageIcon sx={{ fontSize: 16 }} />
              {alt}
            </p>
          </div>
        )}
      </div>
    ),

    // Inputs (checkboxes in markdown)
    input: ({ type, checked, ...props }: any) => (
      <input
        type={type}
        checked={checked}
        className='mr-2 h-4 w-4 rounded border-muted text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer'
        {...props}
      />
    ),

    // Emphasis
    em: ({ ...props }: any) => <em className='italic text-foreground/80 font-medium' {...props} />,
    strong: ({ ...props }: any) => <strong className='font-bold text-foreground' {...props} />,
  };
};
