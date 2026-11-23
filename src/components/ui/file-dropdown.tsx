"use client";

import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@/components/ui/icon-button";
import { CircularProgress } from "@/components/ui/spinner";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

export interface FileDropdownProps {
  value?: string | string[] | null;
  onFilesSelect: (files: File[]) => void | Promise<void>;
  onRemove?: (index: number) => void;
  multiple?: boolean;
  accept?: string;
  uploading?: boolean;
  disabled?: boolean;
  showThumbnailBadge?: boolean;
  title?: string;
  subtitle?: string;
  error?: boolean;
  helperText?: string;
  mediaType?: "image" | "video" | string;
  resolveUrl?: (path: string) => string;
}

export function FileDropdown({
  value,
  onFilesSelect,
  onRemove,
  multiple = false,
  accept = "image/*",
  uploading = false,
  disabled = false,
  showThumbnailBadge = true,
  title,
  subtitle = "PNG, JPG, WEBP up to 5MB",
  error = false,
  helperText,
  mediaType,
  resolveUrl = getAssetUrl,
}: FileDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const items = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
  const isInteractive = !uploading && !disabled;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !isInteractive) return;
    const files = Array.from(fileList);
    onFilesSelect(multiple ? files : [files[0]]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInteractive && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isInteractive) return;
    handleFiles(e.dataTransfer.files);
  };

  const defaultTitle = multiple
    ? "Click to upload or drag & drop images"
    : items.length > 0
      ? "Click or drop a new image to replace"
      : "Click to upload or drag & drop image";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* Previews */}
      {items.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {items.map((url, idx) => (
            <Box
              key={`${url}-${idx}`}
              sx={{
                position: "relative",
                width: multiple ? { xs: 88, sm: 100 } : 96,
                height: multiple ? { xs: 88, sm: 100 } : 96,
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: multiple && showThumbnailBadge && idx === 0 ? tokens.primary : tokens.borderDefault,
                bgcolor: tokens.bgSubtle,
                flexShrink: 0,
              }}
            >
              {mediaType === "video" || /\.(mp4|mov|webm|ogg)$/i.test(url) ? (
                <Box
                  component="video"
                  src={resolveUrl(url)}
                  controls
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <Box
                  component="img"
                  src={resolveUrl(url)}
                  alt={`Uploaded preview ${idx + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              {onRemove && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(idx);
                  }}
                  aria-label="Remove image"
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "rgba(15, 23, 42, 0.72)",
                    color: "#FFFFFF",
                    p: 0.4,
                    "&:hover": { bgcolor: tokens.danger },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              )}
              {multiple && showThumbnailBadge && idx === 0 && (
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: tokens.primary,
                    color: tokens.onPrimary,
                    fontSize: 10,
                    textAlign: "center",
                    py: 0.25,
                    fontWeight: 700,
                  }}
                >
                  Thumbnail
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Drag & Drop Zone */}
      <Box
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        onClick={() => isInteractive && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2.5,
          py: { xs: 2.5, sm: 3 },
          borderRadius: "14px",
          border: "2px dashed",
          borderColor: error
            ? tokens.danger
            : isDragging
              ? tokens.primary
              : tokens.borderDefault,
          bgcolor: isDragging ? "rgba(0, 191, 166, 0.06)" : "#F8FAFC",
          cursor: isInteractive ? "pointer" : "not-allowed",
          opacity: disabled ? 0.6 : 1,
          transition: "border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": isInteractive
            ? {
                borderColor: tokens.primary,
                bgcolor: "rgba(0, 191, 166, 0.04)",
              }
            : undefined,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          disabled={!isInteractive}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: "rgba(0, 191, 166, 0.12)",
            color: tokens.primaryDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.25,
          }}
        >
          {uploading ? (
            <CircularProgress size={20} sx={{ color: tokens.primary }} />
          ) : (
            <CloudUploadOutlinedIcon sx={{ fontSize: 22 }} />
          )}
        </Box>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: tokens.textPrimary,
            mb: 0.35,
          }}
        >
          {uploading ? "Uploading..." : (title ?? defaultTitle)}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: tokens.textMuted,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          sx={{ color: error ? tokens.danger : tokens.textSecondary }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
