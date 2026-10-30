"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { IMAGES } from "@/constant/images";
import { tokens } from "@/theme/theme";

interface RecentUsersProps {
  users: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
  }[];
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <Card
      elevation={0}
      sx={{
        gridColumn: { md: "span 3" },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <CardHeader
        title={
          <Typography
            component='h3'
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Recent Users
          </Typography>
        }
        subheader={<Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Latest users who joined the platform.</Typography>}
        sx={{ pb: 1 }}
      />

      <CardContent>
        {users.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography sx={{ fontSize: 14 }}>No recent users found.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {users.map((user) => (
              <Box key={user.id} sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={user.image || IMAGES.default_avatar}
                alt={user.name || "Avatar"}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Box
                sx={{
                  ml: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name || "Anonymous"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Box
                component='span'
                sx={{
                  ml: "auto",
                  flexShrink: 0,
                  fontSize: 12,
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                }}
              >
                {new Date(user.createdAt).toLocaleDateString()}
              </Box>
            </Box>
          ))}
        </Box>
        )}
      </CardContent>
    </Card>
  );
}
