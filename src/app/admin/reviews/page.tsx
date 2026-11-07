"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { Modal, ModalTitle, ModalContent } from "@/components/ui/modal";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dropdown } from "@/components/ui/dropdown";
import { AlertDialog } from "@/components/ui/alert-dialog";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

import { useReviews, useDeleteReview, useToggleReviewStatus } from "@/query-client/reviews/index";
import { ReviewForm } from "./_components/review-form";
import { ReviewStatusChip } from "@/components/admin/review-status-chip";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useReviews();
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: toggleStatus } = useToggleReviewStatus();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  const handleStatusChange = (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    toggleStatus({ id, status });
  };

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "customer",
        header: "Customer",
        cell: (review) => (
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
                {review.customerName ? review.customerName.substring(0, 2).toUpperCase() : "??"}
              </Box>
            )}
            <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
              {review.customerName}
            </Box>
          </Box>
        ),
      },
      {
        id: "rating",
        header: "Rating",
        cell: (review) => (
          <Box sx={{ display: "flex", alignItems: "center", color: tokens.warning }}>
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
            <StarIcon sx={{ fontSize: 14, color: tokens.warning }} />
          </Box>
        ),
      },
      {
        id: "review",
        header: "Review",
        width: 300,
        cell: (review) => (
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
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (review) => <ReviewStatusChip status={review.status} />,
      },
      {
        id: "date",
        header: "Date",
        cell: (review) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
            {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "—"}
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (review) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "Edit",
                icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
                action: () => {
                  setEditingReview(review);
                  setIsCreateOpen(true);
                },
              },
              ...(review.status !== "APPROVED"
                ? [
                    {
                      label: "Approve",
                      icon: <CheckIcon sx={{ fontSize: 18 }} />,
                      action: () => handleStatusChange(review.id, "APPROVED"),
                    },
                  ]
                : []),
              ...(review.status !== "REJECTED"
                ? [
                    {
                      label: "Reject",
                      icon: <CloseIcon sx={{ fontSize: 18 }} />,
                      action: () => handleStatusChange(review.id, "REJECTED"),
                    },
                  ]
                : []),
              "divider" as const,
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setReviewToDelete(review.id),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title='Customer Reviews'
        description='Manage customer testimonials, approval status, and ratings.'
        action={
          <Button
            variant='primary'
            onClick={() => {
              setEditingReview(null);
              setIsCreateOpen(true);
            }}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          >
            Add Review
          </Button>
        }
      />

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={reviews ?? []}
        keyExtractor={(review) => review.id}
        isLoading={isLoading}
        emptyMessage='No reviews found.'
      />

      {/* Create / Edit Modal */}
      <Modal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth='sm'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <ModalTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>
          {editingReview ? "Edit Review" : "Add Review"}
        </ModalTitle>
        <ModalContent dividers>
          <ReviewForm initialData={editingReview} onSuccess={() => setIsCreateOpen(false)} />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDelete}
        title='Move Review to Trash?'
        description='This will move the review to Trash. You can restore it anytime or delete it permanently from the Trash.'
        confirmText='Move to Trash'
        confirmVariant='destructive'
      />
    </Box>
  );
}
