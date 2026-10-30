import * as React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizontalIcon from "@mui/icons-material/MoreHoriz";
import Box, { type BoxProps } from "@mui/material/Box";
import ButtonBase, { type ButtonBaseProps } from "@mui/material/ButtonBase";
import MuiPagination, { type PaginationProps as MuiPaginationProps } from "@mui/material/Pagination";
import MuiPaginationItem, { type PaginationItemProps as MuiPaginationItemProps } from "@mui/material/PaginationItem";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/theme";

export type PaginationProps = MuiPaginationProps & BoxProps<"nav">;

function Pagination({ count, page, onChange, sx, children, ...props }: PaginationProps) {
  if (count !== undefined) {
    return (
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        sx={[
          {
            "& .MuiPaginationItem-root": {
              color: tokens.textSecondary,
              borderColor: tokens.borderDefault,
              fontWeight: 600,
              borderRadius: `${tokens.radiusMd}px`,
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                color: tokens.textPrimary,
              },
              "&.Mui-selected": {
                bgcolor: `${tokens.primary} !important`,
                color: `${tokens.textWhite} !important`,
                borderColor: `${tokens.primary} !important`,
              },
            },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...(props as MuiPaginationProps)}
      />
    );
  }

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
      {...(props as BoxProps<"nav">)}
    >
      {children}
    </Box>
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

function PaginationItem(props: MuiPaginationItemProps & BoxProps<"li">) {
  if ("type" in props || "page" in props || "selected" in props) {
    return <MuiPaginationItem {...(props as MuiPaginationItemProps)} />;
  }
  const { sx, ...rest } = props as BoxProps<"li">;
  return <Box component='li' sx={{ listStyle: "none", ...sx }} {...rest} />;
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
        borderRadius: `${tokens.radiusMd}px`,
        fontSize: "0.85rem",
        fontWeight: 600,
        height: 36,
        minWidth: 36,
        px: size === "default" ? 1.75 : 1,
        color: isActive ? tokens.primary : tokens.textSecondary,
        bgcolor: isActive ? tokens.primarySubtle : "transparent",
        border: "1px solid",
        borderColor: isActive ? tokens.primaryBorder : "transparent",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: isActive ? tokens.primarySubtle : tokens.bgSubtle,
          color: isActive ? tokens.primary : tokens.textPrimary,
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
        color: tokens.textDisabled,
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
