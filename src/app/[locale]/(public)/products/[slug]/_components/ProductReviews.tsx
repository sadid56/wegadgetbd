"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";

import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInteractiveReviews,
  useCreateReview,
  useToggleReviewLike,
  useCreateReviewReply,
} from "@/query-client/products";
import { uploadFileToStorage, getAssetUrl, stripAssetDomain } from "@/lib/storage";
import { formatBnNumber } from "@/lib/utils";
import { tokens } from "@/theme/theme";
import { useToast } from "@/context/toast-context";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import type { ProductReviewItem, ReviewReplyItem } from "@/server/schemas/products.schema";

interface ProductReviewsProps {
  productId: string;
  rating?: number | string | null;
  reviewsCount?: number;
}

export function ProductReviews({ productId, rating: initialRating, reviewsCount = 0 }: ProductReviewsProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const toast = useToast();

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | undefined>(undefined);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(null);
  const [replyingToParentId, setReplyingToParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Review Form States
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Queries & Mutations
  const { data, isLoading } = useInteractiveReviews(productId, { rating: selectedStarFilter });
  const { mutate: submitReview, isPending: isSubmittingReview } = useCreateReview(productId);
  const { mutate: toggleLike } = useToggleReviewLike(productId);
  const { mutate: submitReply, isPending: isSubmittingReply } = useCreateReviewReply(productId);

  const reviews = data?.reviews || [];
  const totalReviews = data?.total ?? reviewsCount;
  const avgRating = data?.averageRating ?? Number(initialRating || 5);
  const ratingCounts = data?.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const formatNumber = (n: number) => (locale === "bn" ? formatBnNumber(n) : n.toString());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploadingImage(true);
    try {
      const files = Array.from(e.target.files).slice(0, 4 - newImages.length);
      for (const file of files) {
        const res = await uploadFileToStorage({ file, folder: "reviews" });
        setNewImages((prev) => [...prev, stripAssetDomain(res.url)]);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please enter your review comment.");
      return;
    }

    submitReview(
      {
        productId,
        rating: newRating,
        title: newTitle.trim() || undefined,
        comment: newComment.trim(),
        images: newImages,
      },
      {
        onSuccess: () => {
          setIsWritingReview(false);
          setNewComment("");
          setNewTitle("");
          setNewImages([]);
          setNewRating(5);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to post review");
        },
      },
    );
  };

  const handleSubmitReply = (reviewId: string, parentId?: string | null) => {
    if (!replyText.trim()) return;

    submitReply(
      {
        reviewId,
        parentId: parentId || undefined,
        comment: replyText.trim(),
      },
      {
        onSuccess: () => {
          setReplyingToReviewId(null);
          setReplyingToParentId(null);
          setReplyText("");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to submit reply");
        },
      },
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* 1. Alibaba Rating Summary & Score Card */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr auto" },
          alignItems: "center",
          gap: { xs: 3, md: 4 },
          p: { xs: 2.5, sm: 3.5 },
          bgcolor: tokens.bgPanel,
          border: "1px solid",
          borderColor: tokens.borderDefault,
          borderRadius: `${tokens.radiusXl}px`,
          boxShadow: tokens.elevation1,
        }}
      >
        {/* Overall Score */}
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            <Typography
              sx={{
                fontSize: { xs: "2.75rem", md: "3.5rem" },
                fontWeight: 900,
                color: tokens.textPrimary,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {locale === "bn" ? formatBnNumber(avgRating) : avgRating.toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: tokens.textMuted }}>
              / 5.0
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "3px", my: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon
                key={s}
                sx={{
                  fontSize: 22,
                  color: s <= Math.round(avgRating) ? tokens.warning : tokens.borderDefault,
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: 13.5, color: tokens.textSecondary }}>
            {formatNumber(totalReviews)} verified customer ratings
          </Typography>
        </Box>

        {/* 5-Star Distribution Bars */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = (ratingCounts as any)[star] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const isSelected = selectedStarFilter === star;

            return (
              <Box
                key={star}
                onClick={() => setSelectedStarFilter(isSelected ? undefined : star)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  p: 0.5,
                  borderRadius: "6px",
                  bgcolor: isSelected ? "action.hover" : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, width: 38, color: "text.primary" }}>
                  {star} Star
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: star >= 4 ? tokens.success : star === 3 ? tokens.warning : tokens.danger,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 12, color: "text.secondary", width: 28, textAlign: "right" }}>
                  {formatNumber(count)}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="primary"
            onClick={() => setIsWritingReview((prev) => !prev)}
            sx={{
              fontWeight: 700,
              fontSize: 14,
              px: 3,
              py: 1.25,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(0, 167, 111, 0.25)",
            }}
          >
            {isWritingReview ? "Cancel Review" : "Write a Review"}
          </Button>
        </Box>
      </Box>

      {/* 2. Interactive "Write a Review" Form */}
      {isWritingReview && (
        <Box
          component="form"
          onSubmit={handleSubmitReview}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            bgcolor: tokens.bgCanvas,
            border: "1px solid",
            borderColor: tokens.primary,
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
            Share Your Experience with this Product
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>
              Overall Rating:
            </Typography>
            <Rating
              value={newRating}
              onChange={(_, val) => setNewRating(val || 5)}
              size="large"
              sx={{ color: tokens.warning }}
            />
          </Box>

          <TextField
            label="Review Headline / Title (Optional)"
            placeholder="e.g. Excellent build quality and super fast delivery!"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Detailed Review Comment *"
            placeholder="Tell us what you liked, features, durability, or performance of this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />

          {/* Photos Upload */}
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1 }}>
              Add Photos (Optional, max 4):
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              {newImages.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 64,
                    height: 64,
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={getAssetUrl(img)}
                    alt="Upload preview"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      p: 0.25,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}

              {newImages.length < 4 && (
                <Button
                  variant="outline"
                  component="label"
                  disabled={isUploadingImage}
                  startIcon={isUploadingImage ? <CircularProgress size={16} /> : <AddPhotoAlternateOutlinedIcon />}
                  sx={{ height: 64, px: 2, borderRadius: "8px", borderStyle: "dashed" }}
                >
                  {isUploadingImage ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}>
            <Button variant="outline" type="button" onClick={() => setIsWritingReview(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmittingReview}>
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </Box>
        </Box>
      )}

      {/* 3. Star Filter Tabs */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`All Reviews (${formatNumber(totalReviews)})`}
          onClick={() => setSelectedStarFilter(undefined)}
          color={selectedStarFilter === undefined ? "primary" : "default"}
          variant={selectedStarFilter === undefined ? "filled" : "outlined"}
          sx={{ fontWeight: 600, cursor: "pointer" }}
        />
        {[5, 4, 3, 2, 1].map((s) => (
          <Chip
            key={s}
            label={`${s}★ (${formatNumber((ratingCounts as any)[s] || 0)})`}
            onClick={() => setSelectedStarFilter(selectedStarFilter === s ? undefined : s)}
            color={selectedStarFilter === s ? "primary" : "default"}
            variant={selectedStarFilter === s ? "filled" : "outlined"}
            sx={{ fontWeight: 600, cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* 4. Reviews List */}
      {isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: "14px" }} />
          ))}
        </Box>
      ) : reviews.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            bgcolor: tokens.bgPanel,
            border: "1px dashed",
            borderColor: tokens.borderDefault,
            borderRadius: "14px",
          }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
            No reviews yet for this filter.
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
            Be the first to share your thoughts and rate this product!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {reviews.map((rev) => (
            <ReviewItemCard
              key={rev.id}
              review={rev}
              onToggleLike={() => toggleLike({ reviewId: rev.id })}
              replyingToReviewId={replyingToReviewId}
              replyingToParentId={replyingToParentId}
              onOpenReply={(parentId) => {
                setReplyingToReviewId(rev.id);
                setReplyingToParentId(parentId || null);
                setReplyText("");
              }}
              onCloseReply={() => {
                setReplyingToReviewId(null);
                setReplyingToParentId(null);
                setReplyText("");
              }}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onSubmitReply={(parentId) => handleSubmitReply(rev.id, parentId)}
              isSubmittingReply={isSubmittingReply}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------
// Review Item Card Component
// ----------------------------------------------------
interface ReviewItemCardProps {
  review: ProductReviewItem;
  onToggleLike: () => void;
  replyingToReviewId: string | null;
  replyingToParentId: string | null;
  onOpenReply: (parentId?: string) => void;
  onCloseReply: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSubmitReply: (parentId?: string | null) => void;
  isSubmittingReply: boolean;
}

function ReviewItemCard({
  review,
  onToggleLike,
  replyingToReviewId,
  replyingToParentId,
  onOpenReply,
  onCloseReply,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isSubmittingReply,
}: ReviewItemCardProps) {
  const isDirectReplyOpen = replyingToReviewId === review.id && !replyingToParentId;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: tokens.bgCanvas,
        border: "1px solid",
        borderColor: tokens.borderSubtle,
        borderRadius: `${tokens.radiusLg}px`,
        boxShadow: tokens.elevation1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "border-color 150ms, box-shadow 150ms",
        "&:hover": { borderColor: tokens.borderDefault, boxShadow: tokens.elevation2 },
      }}
    >
      {/* Header: User Avatar + Name + Rating + Date */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar
            src={review.userAvatar ? getAssetUrl(review.userAvatar) : undefined}
            sx={{ width: 44, height: 44, bgcolor: tokens.primary, fontSize: 16, fontWeight: 700 }}
          >
            {review.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: "text.primary" }}>
                {review.userName}
              </Typography>
              {review.isVerifiedPurchase && (
                <Badge
                  variant="success"
                  size="small"
                  icon={<VerifiedIcon sx={{ fontSize: "13px !important" }} />}
                  label="Verified Purchase"
                />
              )}
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "Recently"}
            </Typography>
          </Box>
        </Box>

        {/* Stars */}
        <Box sx={{ display: "flex", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              sx={{
                fontSize: 18,
                color: s <= review.rating ? tokens.warning : tokens.borderDefault,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Review Title & Body */}
      {review.title && (
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "text.primary" }}>
          {review.title}
        </Typography>
      )}
      <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6, whiteSpace: "pre-line" }}>
        {review.comment}
      </Typography>

      {/* Review Images Preview */}
      {review.images && review.images.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 0.5 }}>
          {review.images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={getAssetUrl(img)}
              alt="Review attachment"
              sx={{
                width: 72,
                height: 72,
                borderRadius: "8px",
                objectFit: "cover",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "transform 150ms",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          ))}
        </Box>
      )}

      {/* Actions: Helpful (Like) & Reply Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 1, borderTop: "1px solid", borderColor: "action.hover" }}>
        <Button
          size="small"
          variant="ghost"
          onClick={onToggleLike}
          startIcon={review.isLiked ? <ThumbUpIcon sx={{ fontSize: 16, color: tokens.primary }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: 13,
            color: review.isLiked ? tokens.primary : "text.secondary",
            fontWeight: review.isLiked ? 700 : 500,
          }}
        >
          Helpful ({review.likesCount})
        </Button>

        <Button
          size="small"
          variant="ghost"
          startIcon={<ReplyOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => (isDirectReplyOpen ? onCloseReply() : onOpenReply())}
          sx={{ fontSize: 13, color: "text.secondary" }}
        >
          Reply ({review.replies?.length || 0})
        </Button>
      </Box>

      {/* Inline Reply Input for Direct Review Reply */}
      {isDirectReplyOpen && (
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, pl: { sm: 2 } }}>
          <TextField
            placeholder={`Reply to ${review.userName}...`}
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
          <Button
            variant="primary"
            size="small"
            disabled={isSubmittingReply || !replyText.trim()}
            onClick={() => onSubmitReply(null)}
            endIcon={<SendIcon sx={{ fontSize: 14 }} />}
          >
            Reply
          </Button>
        </Box>
      )}

      {/* Nested Replies Thread with Facebook-style Chain Border & Cards */}
      {review.replies && review.replies.length > 0 && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${tokens.borderSubtle}`,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: tokens.textSecondary,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <ReplyOutlinedIcon sx={{ fontSize: 16, transform: "rotate(180deg)", color: tokens.primary }} />
            <span>Discussion & Replies ({review.replies.length})</span>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.25,
              position: "relative",
            }}
          >
            {review.replies.map((reply, idx) => (
              <ReplyItemComponent
                key={reply.id}
                reply={reply}
                reviewId={review.id}
                replyingToReviewId={replyingToReviewId}
                replyingToParentId={replyingToParentId}
                onOpenReply={(parentId) => onOpenReply(parentId)}
                onCloseReply={onCloseReply}
                replyText={replyText}
                onReplyTextChange={onReplyTextChange}
                onSubmitReply={(parentId) => onSubmitReply(parentId)}
                isSubmittingReply={isSubmittingReply}
                isLast={idx === review.replies!.length - 1}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------
// Recursive Nested Reply Component (Facebook-Style Card + Chain Connector)
// ----------------------------------------------------
interface ReplyItemComponentProps {
  reply: ReviewReplyItem;
  reviewId: string;
  replyingToReviewId: string | null;
  replyingToParentId: string | null;
  onOpenReply: (parentId?: string) => void;
  onCloseReply: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSubmitReply: (parentId?: string | null) => void;
  isSubmittingReply: boolean;
  isLast?: boolean;
}

function ReplyItemComponent({
  reply,
  reviewId,
  replyingToReviewId,
  replyingToParentId,
  onOpenReply,
  onCloseReply,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isSubmittingReply,
  isLast = false,
}: ReplyItemComponentProps) {
  const isNestedReplyOpen = replyingToReviewId === reviewId && replyingToParentId === reply.id;
  const isAdmin = reply.userRole === "ADMIN";

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        pl: { xs: 2.75, sm: 3.5 },
      }}
    >
      {/* 1. Left Vertical Chain Line */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 8, sm: 12 },
          top: 0,
          bottom: isLast && (!reply.replies || reply.replies.length === 0) ? "calc(100% - 24px)" : 0,
          width: "2px",
          bgcolor: tokens.borderDefault,
        }}
      />

      {/* 2. Curved Branch Connector to Avatar and Card (Facebook L-curve) */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 8, sm: 12 },
          top: 0,
          width: { xs: 14, sm: 16 },
          height: 24,
          borderLeft: `2px solid ${tokens.borderDefault}`,
          borderBottom: `2px solid ${tokens.borderDefault}`,
          borderBottomLeftRadius: "12px",
          pointerEvents: "none",
        }}
      />

      {/* 3. Reply Content Row (Avatar + Card Bubble) */}
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", width: "100%" }}>
        <Avatar
          src={reply.userAvatar ? getAssetUrl(reply.userAvatar) : undefined}
          sx={{
            width: 32,
            height: 32,
            fontSize: 13,
            fontWeight: 700,
            bgcolor: isAdmin ? tokens.warning : tokens.primary,
            flexShrink: 0,
            mt: 0.75,
            boxShadow: tokens.elevation1,
          }}
        >
          {reply.userName.charAt(0).toUpperCase()}
        </Avatar>

        {/* Card-based Comment Bubble */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: "16px",
              p: 1.75,
              py: 1.25,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              boxShadow: tokens.elevation1,
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                borderColor: tokens.borderHover,
                boxShadow: tokens.elevation2,
              },
            }}
          >
            {/* Header: User name + role badge + date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textPrimary }}>
                  {reply.userName}
                </Typography>
                {isAdmin && (
                  <Badge variant="warning" size="small" label="Staff / Store Admin" />
                )}
              </Box>

              <Typography variant="caption" sx={{ color: tokens.textMuted, fontSize: 11.5 }}>
                {reply.createdAt ? format(new Date(reply.createdAt), "MMM d, h:mm a") : ""}
              </Typography>
            </Box>

            {/* Comment Body */}
            <Typography
              sx={{
                fontSize: 13.5,
                color: tokens.textSecondary,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {reply.comment}
            </Typography>
          </Box>

          {/* Action Row below the card bubble */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pl: 1, mt: 0.25 }}>
            <Box
              component="button"
              type="button"
              onClick={() => (isNestedReplyOpen ? onCloseReply() : onOpenReply(reply.id))}
              sx={{
                background: "transparent",
                border: "none",
                p: 0,
                fontSize: 12,
                fontWeight: 700,
                color: isNestedReplyOpen ? tokens.primary : tokens.textMuted,
                cursor: "pointer",
                transition: "color 0.15s ease",
                "&:hover": {
                  color: tokens.primary,
                  textDecoration: "underline",
                },
              }}
            >
              {isNestedReplyOpen ? "Cancel Reply" : "Reply"}
            </Box>
          </Box>

          {/* Inline Reply Input for Nested Reply */}
          {isNestedReplyOpen && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
                p: 1.25,
                bgcolor: tokens.bgCanvas,
                borderRadius: "14px",
                border: `1px solid ${tokens.borderSubtle}`,
              }}
            >
              <TextField
                placeholder={`Reply to ${reply.userName}...`}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                fullWidth
                size="small"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: tokens.bgPanel,
                    borderRadius: `${tokens.radiusPill}px`,
                  },
                }}
              />
              <Button
                variant="primary"
                size="small"
                disabled={isSubmittingReply || !replyText.trim()}
                onClick={() => onSubmitReply(reply.id)}
                endIcon={<SendIcon sx={{ fontSize: 14 }} />}
                sx={{ px: 2.5 }}
              >
                Reply
              </Button>
            </Box>
          )}

          {/* Recursively render child replies with indented chain */}
          {reply.replies && reply.replies.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.75,
              }}
            >
              {reply.replies.map((childReply: ReviewReplyItem, cIdx: number) => (
                <ReplyItemComponent
                  key={childReply.id}
                  reply={childReply}
                  reviewId={reviewId}
                  replyingToReviewId={replyingToReviewId}
                  replyingToParentId={replyingToParentId}
                  onOpenReply={onOpenReply}
                  onCloseReply={onCloseReply}
                  replyText={replyText}
                  onReplyTextChange={onReplyTextChange}
                  onSubmitReply={onSubmitReply}
                  isSubmittingReply={isSubmittingReply}
                  isLast={cIdx === reply.replies!.length - 1}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
