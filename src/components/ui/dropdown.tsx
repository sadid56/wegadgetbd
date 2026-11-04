"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { type SxProps, type Theme } from "@mui/material/styles";
import { tokens } from "@/theme/theme";

export interface DropdownItem {
  label: React.ReactNode;
  action?: () => void;
  onClick?: () => void;
  href?: string;
  target?: string;
  icon?: React.ReactNode;
  variant?: "default" | "danger" | "destructive";
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  items: (DropdownItem | "divider")[];
  title?: React.ReactNode;
  trigger?: React.ReactNode;
  align?: "left" | "right" | "center";
  disabled?: boolean;
  menuSx?: SxProps<Theme>;
}

export function Dropdown({
  items,
  title,
  trigger,
  align = "right",
  disabled = false,
  menuSx,
}: DropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isRight = align === "right";
  const isCenter = align === "center";
  const horizontal = isRight ? "right" : isCenter ? "center" : "left";

  return (
    <>
      {trigger ? (
        React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              (trigger.props as any)?.onClick?.(e);
              handleOpen(e);
            },
            disabled: disabled || (trigger.props as any)?.disabled,
          })
        ) : (
          <span onClick={handleOpen}>{trigger}</span>
        )
      ) : (
        <IconButton
          size='small'
          onClick={handleOpen}
          disabled={disabled}
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
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal,
        }}
        slotProps={{
          paper: {
            sx: [
              {
                minWidth: 160,
                borderRadius: `${tokens.radiusMd}px`,
                border: `1px solid ${tokens.borderDefault}`,
                bgcolor: tokens.bgElevated,
                boxShadow: tokens.shadowPopover,
                p: 0.5,
              },
              ...(Array.isArray(menuSx) ? menuSx : menuSx ? [menuSx] : []),
            ],
          },
        }}
      >
        {title && (
          <ListSubheader
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: "28px",
              px: 1.5,
              bgcolor: "transparent",
            }}
          >
            {title}
          </ListSubheader>
        )}

        {items.map((item, index) => {
          if (item === "divider") {
            return <Divider key={`divider-${index}`} sx={{ my: 0.5, borderColor: tokens.borderDefault }} />;
          }

          const isDanger = item.danger || item.variant === "danger" || item.variant === "destructive";
          const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleClose();
            if (item.action) item.action();
            else if (item.onClick) item.onClick();
          };

          return (
            <React.Fragment key={index}>
              {item.divider && <Divider sx={{ my: 0.5, borderColor: tokens.borderDefault }} />}
              <MenuItem
                {...(item.href ? ({ component: NextLink, href: item.href, target: item.target } as any) : {})}
                onClick={handleClick}
                disabled={item.disabled}
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: `${tokens.radiusSm}px`,
                  py: 0.8,
                  px: 1.5,
                  gap: 1.25,
                  color: isDanger ? tokens.danger : tokens.textPrimary,
                  "&:hover": {
                    bgcolor: isDanger ? tokens.dangerSubtle : tokens.bgSubtle,
                  },
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color: isDanger ? tokens.danger : "text.secondary",
                      "& .MuiSvgIcon-root": { fontSize: 18 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.label}
                  sx={{
                    m: 0,
                    "& .MuiTypography-root": {
                      fontSize: 13,
                      fontWeight: 500,
                      color: isDanger ? tokens.danger : tokens.textPrimary,
                    },
                  }}
                />
              </MenuItem>
            </React.Fragment>
          );
        })}
      </Menu>
    </>
  );
}

export default Dropdown;
