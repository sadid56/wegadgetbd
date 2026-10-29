import { useAppMutation } from "@/hooks/useAppMutation";
import { useQuery } from "@tanstack/react-query";
import {
  getReviews,
  getApprovedReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewStatus,
  type CreateReviewInput,
  type UpdateReviewInput,
} from "@/actions/reviews";
import type { ReviewStatus } from "@/db/schema";

async function unwrap<T>(fn: () => Promise<{ success: boolean; data?: T; error?: any }>): Promise<T> {
  const res = await fn();
  if (!res.success) throw new Error(res.error ?? "Request failed");
  return res.data as T;
}

const reviewKeys = {
  all: ["reviews"] as const,
  approved: ["approvedReviews"] as const,
};

const invalidateReviews = [reviewKeys.all, reviewKeys.approved];

export const useReviews = () =>
  useQuery({
    queryKey: reviewKeys.all,
    queryFn: () => unwrap(getReviews),
  });

export const useApprovedReviews = () =>
  useQuery({
    queryKey: reviewKeys.approved,
    queryFn: () => unwrap(getApprovedReviews),
  });

export const useCreateReview = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: (data: CreateReviewInput) => unwrap(() => createReview(data)),
    invalidateKeys: invalidateReviews,
    successMessage: "Review created successfully",
    ...options,
  });

export const useUpdateReview = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewInput }) => unwrap(() => updateReview(id, data)),
    invalidateKeys: invalidateReviews,
    successMessage: "Review updated successfully",
    ...options,
  });

export const useDeleteReview = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: (id: string) => unwrap(() => deleteReview(id)),
    invalidateKeys: invalidateReviews,
    successMessage: "Review deleted successfully",
    ...options,
  });

export const useToggleReviewStatus = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) => unwrap(() => toggleReviewStatus(id, status)),
    invalidateKeys: invalidateReviews,
    successMessage: "Review status updated",
    ...options,
  });