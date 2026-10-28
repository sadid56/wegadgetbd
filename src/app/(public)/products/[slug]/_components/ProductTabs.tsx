"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMarkdownComponents } from "@/components/common/MarkdownContent";

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const markdownComponents = useMarkdownComponents();

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ mb: 5 }}>
          <Typography
            component='h2'
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 700,
              color: "#111827",
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            Product Description
          </Typography>
          <Box sx={{ width: 80, height: 4, bgcolor: "#f97316", borderRadius: 999 }} />
        </Box>

        <Box
          sx={{
            maxWidth: "none",
            color: "#374151",
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.7,
            "& > *:first-of-type": { mt: 0 },
            "& > *:last-child": { mb: 0 },
            "& p": { my: 2 },
            "& a": { color: "primary.main", textDecoration: "underline" },
            "& strong": { fontWeight: 700, color: "#111827" },
            "& em": { fontStyle: "italic" },
            "& h1": { fontSize: 28, fontWeight: 800, mt: 4, mb: 2, lineHeight: 1.25, color: "#111827" },
            "& h2": { fontSize: 24, fontWeight: 700, mt: 3.5, mb: 1.75, lineHeight: 1.3, color: "#111827" },
            "& h3": { fontSize: 20, fontWeight: 700, mt: 3, mb: 1.5, lineHeight: 1.35, color: "#111827" },
            "& h4": { fontSize: 18, fontWeight: 700, mt: 2.5, mb: 1.25, color: "#111827" },
            "& h5, & h6": { fontSize: 16, fontWeight: 700, mt: 2, mb: 1, color: "#111827" },
            "& ul, & ol": { pl: 3, my: 2 },
            "& li": { my: 0.5 },
            "& li > p": { my: 0 },
            "& blockquote": {
              borderLeft: "4px solid #e5e7eb",
              pl: 2,
              my: 2,
              color: "#6b7280",
              fontStyle: "italic",
            },
            "& code": {
              bgcolor: "#f3f4f6",
              color: "#b91c1c",
              px: 0.75,
              py: 0.25,
              borderRadius: "4px",
              fontSize: "0.875em",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            },
            "& pre": {
              bgcolor: "#111827",
              color: "#f9fafb",
              p: 2,
              borderRadius: "8px",
              overflowX: "auto",
              my: 2,
              fontSize: 13,
              "& code": {
                bgcolor: "transparent",
                color: "inherit",
                p: 0,
                fontSize: "inherit",
              },
            },
            "& hr": { border: 0, borderTop: "1px solid #e5e7eb", my: 4 },
            "& img": { maxWidth: "100%", height: "auto", borderRadius: "8px", my: 2 },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              my: 2,
              fontSize: 14,
            },
            "& th, & td": {
              border: "1px solid #e5e7eb",
              px: 1.5,
              py: 1,
              textAlign: "left",
            },
            "& th": { bgcolor: "#f9fafb", fontWeight: 700 },
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {product.markdown_description || product.description}
          </Markdown>
        </Box>
      </Box>
    </Box>
  );
}
