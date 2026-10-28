import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { toVideoEmbedUrl } from "@/lib/video-links";

interface ProductVideosProps {
  videoLinks: string[];
}

export default function ProductVideos({ videoLinks }: ProductVideosProps) {
  return (
    <Box sx={{ bgcolor: "#f9fafb", borderTop: "1px solid", borderColor: "divider" }}>
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: 6,
        }}
      >
        <Typography
          component='h2'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            lineHeight: 1.3,
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 24, color: "#ff7319" }} />
          Product Videos
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 3,
          }}
        >
          {videoLinks.map((link, idx) => (
            <Box
              key={idx}
              sx={{
                aspectRatio: "16 / 9",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                component='iframe'
                src={toVideoEmbedUrl(link)}
                title={`Video ${idx + 1}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                sx={{ width: "100%", height: "100%", border: 0 }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
