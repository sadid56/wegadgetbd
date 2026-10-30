import { useAppMutation } from "@/hooks/useAppMutation";
import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/lib/orpc/client";
import type { ReviewStatus } from "@/db/schema";

export type CreateReviewInput = {
  customerName: string;
  customerPic?: string;
  mediaUrl?: string;
  mediaType?: string;
  review: string;
  rating: number;
  status?: ReviewStatus;
  productId?: string;
};

export type UpdateReviewInput = Partial<CreateReviewInput>;

const reviewKeys = {
  all: ["reviews"] as const,
  approved: ["approvedReviews"] as const,
};

export const useReviews = () =>
  useQuery({
    queryKey: reviewKeys.all,
    queryFn: async () => {
      const res = await orpcClient.admin.reviews.list();
      return res;
    },
  });

export const useApprovedReviews = () =>
  useQuery({
    queryKey: reviewKeys.approved,
    queryFn: async () => {
      const res = await orpcClient.admin.reviews.list();
      return res.filter((r: any) => r.status === "APPROVED");
    },
  });

export const useCreateReview = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: (data: any) => orpcClient.admin.reviews.create(data),
    invalidateKeys: [reviewKeys.all, reviewKeys.approved],
    successMessage: "Review created successfully",
    ...options,
  });

export const useUpdateReview = (options?: Record<string, unknown>) =>
  useAppMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      orpcClient.admin.reviews.update({ id, ...data }),
    invalidateKeys: [reviewKeys.all, reviewKeys.approved],
    successMessage: "Review updated successfully",
    ...options,
  });

export const useDeleteReview = () =>
  useAppMutation({
    mutationFn: (id: string) => orpcClient.admin.reviews.delete({ id }),
    invalidateKeys: [reviewKeys.all, reviewKeys.approved],
    successMessage: "Review deleted successfully",
  });

export const useToggleReviewStatus = () =>
  useAppMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      orpcClient.admin.reviews.update({ id, status }),
    invalidateKeys: [reviewKeys.all, reviewKeys.approved],
    successMessage: "Review status updated",
  });
