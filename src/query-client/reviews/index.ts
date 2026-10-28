import { useAppMutation } from "@/hooks/useAppMutation";
import { useQuery } from "@tanstack/react-query";
import {
  getReviews,
  getApprovedReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewStatus,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/actions/reviews";
import type { ReviewStatus } from "@/db/schema";

// Adapters for Server Actions to throw on error for React Query
const fetchReviews = async () => {
  const res = await getReviews();
  if (!res.success) throw new Error(res.error);
  return res.data;
};

const fetchApprovedReviews = async () => {
  const res = await getApprovedReviews();
  if (!res.success) throw new Error(res.error);
  return res.data;
};

// Hooks
export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });
};

export const useApprovedReviews = () => {
  return useQuery({
    queryKey: ["approvedReviews"],
    queryFn: fetchApprovedReviews,
  });
};

export const useCreateReview = () =>
  useAppMutation({
    mutationFn: async (data: CreateReviewInput) => {
      const res = await createReview(data);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    invalidateKeys: [["reviews"], ["approvedReviews"]],
    successMessage: "Review created successfully",
  });

export const useUpdateReview = () =>
  useAppMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReviewInput }) => {
      const res = await updateReview(id, data);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    invalidateKeys: [["reviews"], ["approvedReviews"]],
    successMessage: "Review updated successfully",
  });

export const useDeleteReview = () =>
  useAppMutation({
    mutationFn: async (id: string) => {
      const res = await deleteReview(id);
      if (!res.success) throw new Error(res.error);
      return res.success;
    },
    invalidateKeys: [["reviews"], ["approvedReviews"]],
    successMessage: "Review deleted successfully",
  });

export const useToggleReviewStatus = () =>
  useAppMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReviewStatus }) => {
      const res = await toggleReviewStatus(id, status);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    invalidateKeys: [["reviews"], ["approvedReviews"]],
    successMessage: "Review status updated",
  });
