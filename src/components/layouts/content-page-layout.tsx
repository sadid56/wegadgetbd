"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { tokens } from "@/theme/theme";

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
      component="h2"
      sx={{
        fontSize: { xs: "1.35rem", md: "1.5rem" },
        fontWeight: 800,
        color: tokens.textPrimary,
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
      component="h2"
      sx={{
        fontSize: { xs: "1.15rem", md: "1.25rem" },
        fontWeight: 700,
        color: tokens.textPrimary,
        lineHeight: 1.35,
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
      component="h3"
      sx={{
        fontSize: { xs: "1rem", md: "1.05rem" },
        fontWeight: 700,
        color: tokens.textPrimary,
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
      component="p"
      sx={{
        fontSize: "inherit",
        lineHeight: 1.75,
        color: tokens.textSecondary,
        mb: 2,
        "&:last-child": { mb: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box
      component="ul"
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
      component="ol"
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
      component="li"
      sx={{
        fontSize: "inherit",
        lineHeight: 1.65,
        color: tokens.textSecondary,
      }}
    >
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Box component="strong" sx={{ color: tokens.textPrimary, fontWeight: 700 }}>
      {children}
    </Box>
  ),
  a: ({ href, children }) => (
    <Box
      component="a"
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      sx={{
        color: tokens.primary,
        textDecoration: "none",
        fontWeight: 500,
        "&:hover": { textDecoration: "underline" },
      }}
    >
      {children}
    </Box>
  ),
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: "3px solid",
        borderColor: tokens.primary,
        pl: 2.5,
        py: 1,
        my: 2.5,
        fontStyle: "italic",
        bgcolor: tokens.bgSubtle,
        borderRadius: "0 8px 8px 0",
        color: tokens.textSecondary,
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
        borderColor: tokens.borderSubtle,
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
      const words = title.split(" ");
      if (words.length > 1) {
        const last = words.pop();
        return (
          <>
            {words.join(" ")}{" "}
            <Box component="span" sx={{ color: tokens.primary }}>
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
        <Box key={index} component="span" sx={{ color: tokens.primary }}>
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
        minHeight: "100vh",
        bgcolor: tokens.bgCanvas,
        py: { xs: 5, md: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <NextLink href="/" style={{ textDecoration: "none" }}>
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                fontSize: 13,
                fontWeight: 600,
                color: tokens.textSecondary,
                mb: 2,
                transition: "color 150ms",
                "&:hover": { color: tokens.primary },
              }}
            >
              ← হোমপেজে ফিরে যান
            </Typography>
          </NextLink>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.35rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              color: tokens.textPrimary,
              mb: lastUpdated ? 1 : 0,
            }}
          >
            {renderTitle()}
          </Typography>

          {lastUpdated && (
            <Typography
              sx={{
                color: tokens.textMuted,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              সর্বশেষ আপডেট: {lastUpdated}
            </Typography>
          )}
        </Box>

        {/* Solid Content Card (No Gradients) */}
        <Box
          sx={{
            bgcolor: tokens.bgPanel,
            border: "1px solid",
            borderColor: tokens.borderDefault,
            borderRadius: "16px",
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontSize: { xs: 14, md: 15 },
            lineHeight: 1.75,
            color: tokens.textSecondary,
          }}
        >
          {markdown && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {markdown}
            </ReactMarkdown>
          )}

          {sections &&
            sections.map((section, idx) => (
              <Box key={idx} component="section" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {section.title && (
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: 17, md: 19 },
                      fontWeight: 700,
                      color: tokens.textPrimary,
                      lineHeight: 1.35,
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
