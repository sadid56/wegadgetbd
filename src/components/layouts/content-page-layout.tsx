"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ContentSection {
  title?: string;
  content: React.ReactNode;
}

export interface ContentPageLayoutProps {
  title: string;
  highlightedWord?: string;
  lastUpdated?: string;
  markdown?: string;
  sections?: ContentSection[];
  children?: React.ReactNode;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <Typography
      component='h2'
      sx={{
        fontSize: { xs: "1.35rem", md: "1.5rem" },
        fontWeight: 800,
        color: "text.primary",
        mt: 4,
        mb: 2,
        "&:first-of-type": { mt: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography
      component='h2'
      sx={{
        fontSize: { xs: 18, md: 20 },
        fontWeight: 700,
        color: "text.primary",
        lineHeight: 1.3,
        mt: 3.5,
        mb: 1.5,
        "&:first-of-type": { mt: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography
      component='h3'
      sx={{
        fontSize: { xs: 16, md: 17 },
        fontWeight: 700,
        color: "text.primary",
        lineHeight: 1.4,
        mt: 2.5,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography
      component='p'
      sx={{
        fontSize: "inherit",
        lineHeight: 1.7,
        color: "text.secondary",
        mb: 2,
        "&:last-child": { mb: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box
      component='ul'
      sx={{
        pl: 3,
        my: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        listStyleType: "disc",
        "& li": { pl: 0.5 },
      }}
    >
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box
      component='ol'
      sx={{
        pl: 3,
        my: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        listStyleType: "decimal",
        "& li": { pl: 0.5 },
      }}
    >
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Typography
      component='li'
      sx={{
        fontSize: "inherit",
        lineHeight: 1.65,
        color: "text.secondary",
      }}
    >
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Box component='strong' sx={{ color: "text.primary", fontWeight: 700 }}>
      {children}
    </Box>
  ),
  a: ({ href, children }) => (
    <Box
      component='a'
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      sx={{
        color: "primary.main",
        textDecoration: "none",
        fontWeight: 500,
        transition: "text-decoration 200ms",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      {children}
    </Box>
  ),
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: "4px solid",
        borderColor: "primary.main",
        pl: 2.5,
        py: 1,
        my: 2,
        fontStyle: "italic",
        bgcolor: "action.hover",
        borderRadius: "0 8px 8px 0",
      }}
    >
      {children}
    </Box>
  ),
  hr: () => (
    <Box
      sx={{
        my: 4,
        border: "none",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    />
  ),
};

export function ContentPageLayout({
  title,
  highlightedWord,
  lastUpdated,
  markdown,
  sections,
  children,
}: ContentPageLayoutProps) {
  const renderTitle = () => {
    if (!highlightedWord) {
      // Default: highlight the last word if title has multiple words
      const words = title.split(" ");
      if (words.length > 1) {
        const last = words.pop();
        return (
          <>
            {words.join(" ")}{" "}
            <Box component='span' sx={{ color: "primary.main" }}>
              {last}
            </Box>
          </>
        );
      }
      return title;
    }

    const regex = new RegExp(`(${highlightedWord})`, "gi");
    const parts = title.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === highlightedWord.toLowerCase() ? (
        <Box key={index} component='span' sx={{ color: "primary.main" }}>
          {part}
        </Box>
      ) : (
        part
      ),
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 8, md: 10 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Background ambient lighting */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(99,102,241,0.08)",
            filter: "blur(120px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            bgcolor: "rgba(96,165,250,0.08)",
            filter: "blur(120px)",
          }}
        />
      </Box>

      <Container maxWidth='md' sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <NextLink href='/' style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "inline-block",
                mb: 2,
                color: "primary.main",
                fontWeight: 500,
                textDecoration: "none",
                transition: "text-decoration 200ms",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              ← Back to Home
            </Box>
          </NextLink>

          <Typography
            component='h1'
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              mb: lastUpdated ? 1.5 : 0,
              lineHeight: 1.1,
              color: "text.primary",
            }}
          >
            {renderTitle()}
          </Typography>

          {lastUpdated && (
            <Typography
              sx={{
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Last Updated: {lastUpdated}
            </Typography>
          )}
        </Box>

        {/* Content Card */}
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            p: { xs: 3.5, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.7,
            color: "text.secondary",
          }}
        >
          {markdown && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {markdown}
            </ReactMarkdown>
          )}

          {sections &&
            sections.map((section, idx) => (
              <Box key={idx} component='section' sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {section.title && (
                  <Typography
                    component='h2'
                    sx={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.3,
                    }}
                  >
                    {section.title}
                  </Typography>
                )}
                {typeof section.content === "string" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {section.content}
                  </ReactMarkdown>
                ) : (
                  section.content
                )}
              </Box>
            ))}

          {children}
        </Box>
      </Container>
    </Box>
  );
}

export default ContentPageLayout;

