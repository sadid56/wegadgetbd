import * as React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizontalIcon from "@mui/icons-material/MoreHoriz";
import Box, { type BoxProps } from "@mui/material/Box";
import ButtonBase, { type ButtonBaseProps } from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { studioTokens } from "@/theme/theme";

function Pagination({ sx, ...props }: BoxProps<"nav">) {
  return (
    <Box
      component='nav'
      role='navigation'
      aria-label='pagination'
      sx={{
        mx: "auto",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        ...sx,
      }}
      {...props}
    />
  );
}

function PaginationContent({ sx, ...props }: BoxProps<"ul">) {
  return (
    <Box
      component='ul'
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0.5,
        listStyle: "none",
        p: 0,
        m: 0,
        ...sx,
      }}
      {...props}
    />
  );
}

function PaginationItem({ sx, ...props }: BoxProps<"li">) {
  return <Box component='li' sx={{ listStyle: "none", ...sx }} {...props} />;
}

export interface PaginationLinkProps extends ButtonBaseProps {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
}

function PaginationLink({
  isActive,
  size = "icon",
  sx,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <ButtonBase
      aria-current={isActive ? "page" : undefined}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${studioTokens.radiusMd}px`,
        fontSize: "0.85rem",
        fontWeight: 600,
        height: 36,
        minWidth: 36,
        px: size === "default" ? 1.75 : 1,
        color: isActive ? studioTokens.primaryLight : "text.secondary",
        bgcolor: isActive ? studioTokens.primarySubtle : "transparent",
        border: "1px solid",
        borderColor: isActive ? studioTokens.primaryBorder : "transparent",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: isActive ? studioTokens.primarySubtle : "action.hover",
          color: isActive ? studioTokens.primaryLight : "text.primary",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

function PaginationPrevious({
  children,
  sx,
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      sx={{ gap: 0.5, px: 1.5, ...sx }}
      {...props}
    >
      <ChevronLeftIcon sx={{ fontSize: 18 }} />
      {children ?? <Typography component='span' sx={{ fontSize: "0.85rem", display: { xs: "none", sm: "inline" } }}>Previous</Typography>}
    </PaginationLink>
  );
}

function PaginationNext({
  children,
  sx,
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      sx={{ gap: 0.5, px: 1.5, ...sx }}
      {...props}
    >
      {children ?? <Typography component='span' sx={{ fontSize: "0.85rem", display: { xs: "none", sm: "inline" } }}>Next</Typography>}
      <ChevronRightIcon sx={{ fontSize: 18 }} />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  sx,
  ...props
}: BoxProps<"span">) {
  return (
    <Box
      component='span'
      aria-hidden
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        color: "text.disabled",
        ...sx,
      }}
      {...props}
    >
      <MoreHorizontalIcon sx={{ fontSize: 18 }} />
    </Box>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
