import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductBreadcrumb() {
  return (
    <Box>
      <Container maxWidth='lg' sx={{ py: 2 }}>
        <Box
          component={NextLink}
          href='/products'
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontSize: 14,
            color: "#4b5563",
            textDecoration: "none",
            transition: "color 200ms",
            "&:hover": { color: "#ff7319" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <Box component='span' sx={{ fontWeight: 500 }}>
            Back to Products
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
