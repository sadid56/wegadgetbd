"use client";

import { useState } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Chip } from "@/components/ui/badge";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Divider } from "@/components/ui/divider";
import { CircularProgress } from "@/components/ui/spinner";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui/table";

import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

import { useReviews, useDeleteReview, useToggleReviewStatus } from "@/query-client/reviews/index";
import { ReviewForm } from "./_components/review-form";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

const tableHeadSx = {
  fontSize: 12,
  fontWeight: 600,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  bgcolor: "action.hover",
  borderBottom: "1px solid",
  borderColor: "divider",
  py: 1.25,
  whiteSpace: "nowrap",
} as const;

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: 14,
  borderRadius: "8px",
  height: 40,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  boxShadow: "none",
  "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
} as const;

function ReviewStatusChip({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <Chip
        label={status}
        size='small'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  if (status === "PENDING") {
    return (
      <Chip
        label={status}
        size='small'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "action.hover",
          color: "text.primary",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  return (
    <Chip
      label={status}
      size='small'
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: "error.main",
        color: "error.contrastText",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useReviews();
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: toggleStatus } = useToggleReviewStatus();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuReviewId, setMenuReviewId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(id);
    }
  };

  const handleStatusChange = (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    toggleStatus({ id, status });
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>, reviewId: string) => {
    setMenuAnchor(e.currentTarget);
    setMenuReviewId(reviewId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuReviewId(null);
  };

  const activeReview = menuReviewId ? reviews?.find((r: any) => r.id === menuReviewId) : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Customer Reviews
        </Typography>
        <Button
          variant='contained'
          disableElevation
          onClick={() => {
            setEditingReview(null);
            setIsCreateOpen(true);
          }}
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={primaryButtonSx}
        >
          Add Review
        </Button>
      </Box>

      {/* Create / Edit dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth='sm'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>{editingReview ? "Edit Review" : "Add Review"}</DialogTitle>
        <DialogContent dividers>
          <ReviewForm initialData={editingReview} onSuccess={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Table */}
      <TableContainer
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadSx}>Customer</TableCell>
              <TableCell sx={tableHeadSx}>Rating</TableCell>
              <TableCell sx={{ ...tableHeadSx, width: 300 }}>Review</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={tableHeadSx}>Date</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : !reviews || reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review: any) => (
                <TableRow
                  key={review.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  {/* Customer */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {review.customerPic ? (
                        <Box
                          component='img'
                          src={getAssetUrl(review.customerPic)}
                          alt={review.customerName}
                          sx={{
                            height: 32,
                            width: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 32,
                            width: 32,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "text.primary",
                            flexShrink: 0,
                          }}
                        >
                          {review.customerName.substring(0, 2).toUpperCase()}
                        </Box>
                      )}
                      <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                        {review.customerName}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: tokens.warning,
                      }}
                    >
                      <Box
                        component='span'
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          mr: 0.5,
                          fontSize: 14,
                        }}
                      >
                        {review.rating}
                      </Box>
                      <StarIcon sx={{ fontSize: 12, color: tokens.warning }} />
                    </Box>
                  </TableCell>

                  {/* Review text */}
                  <TableCell>
                    <Box
                      component='p'
                      sx={{
                        m: 0,
                        fontSize: 14,
                        color: "text.secondary",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {review.review}
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <ReviewStatusChip status={review.status} />
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton
                      size='small'
                      onClick={(e) => openMenu(e, review.id)}
                      aria-label='Open menu'
                      sx={{
                        width: 32,
                        height: 32,
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row actions menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 180,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              py: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 0.75 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Actions
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            if (activeReview) {
              setEditingReview(activeReview);
              setIsCreateOpen(true);
            }
            closeMenu();
          }}
        >
          Edit
        </MenuItem>

        {activeReview && activeReview.status !== "APPROVED" && (
          <MenuItem
            variant='accent'
            onClick={() => {
              if (menuReviewId) handleStatusChange(menuReviewId, "APPROVED");
              closeMenu();
            }}
          >
            <CheckIcon />
            Approve
          </MenuItem>
        )}

        {activeReview && activeReview.status !== "REJECTED" && (
          <MenuItem
            onClick={() => {
              if (menuReviewId) handleStatusChange(menuReviewId, "REJECTED");
              closeMenu();
            }}
          >
            <CloseIcon />
            Reject
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          variant='danger'
          onClick={() => {
            if (menuReviewId) handleDelete(menuReviewId);
            closeMenu();
          }}
        >
          <DeleteOutlineIcon />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
