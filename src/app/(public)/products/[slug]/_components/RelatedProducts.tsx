import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ProductCard } from "../../../_components/ProductCard";

interface RelatedProductsProps {
  products: any[];
  categorySlug: string;
}

export default function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  return (
    <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Typography
            component='h2'
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            You May Also Like
          </Typography>

          <Box
            component={NextLink}
            href={`/products?category=${categorySlug}`}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#ff7319",
              textDecoration: "none",
              transition: "text-decoration 200ms",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View All →
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
