"use client";

import React, { useRef, useState } from "react";
import NextLink from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
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
  children?: (DropdownItem | "divider")[];
}

export interface DropdownProps {
  items: (DropdownItem | "divider")[];
  title?: React.ReactNode;
  trigger?: React.ReactNode;
  align?: "left" | "right" | "center";
  disabled?: boolean;
  menuSx?: SxProps<Theme>;
  triggerOn?: "click" | "hover";
}

export function Dropdown({
  items,
  title,
  trigger,
  align = "right",
  disabled = false,
  menuSx,
  triggerOn = "click",
}: DropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSubItem, setActiveSubItem] = useState<DropdownItem | null>(null);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const open = Boolean(anchorEl);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setAnchorEl(null);
      setSubAnchorEl(null);
      setActiveSubItem(null);
    }, 150);
  };

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    clearCloseTimer();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    clearCloseTimer();
    setAnchorEl(null);
    setSubAnchorEl(null);
    setActiveSubItem(null);
  };

  const isRight = align === "right";
  const isCenter = align === "center";
  const horizontal = isRight ? "right" : isCenter ? "center" : "left";

  const isHover = triggerOn === "hover";

  return (
    <>
      {trigger ? (
        React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              (trigger.props as any)?.onClick?.(e);
              handleOpen(e);
            },
            onMouseEnter: isHover
              ? (e: React.MouseEvent<HTMLElement>) => {
                  (trigger.props as any)?.onMouseEnter?.(e);
                  handleOpen(e);
                }
              : (trigger.props as any)?.onMouseEnter,
            onMouseLeave: isHover
              ? (e: React.MouseEvent<HTMLElement>) => {
                  (trigger.props as any)?.onMouseLeave?.(e);
                  scheduleClose();
                }
              : (trigger.props as any)?.onMouseLeave,
            disabled: disabled || (trigger.props as any)?.disabled,
          })
        ) : (
          <span
            onClick={handleOpen}
            onMouseEnter={isHover ? handleOpen : undefined}
            onMouseLeave={isHover ? scheduleClose : undefined}
          >
            {trigger}
          </span>
        )
      ) : (
        <IconButton
          size='small'
          onClick={handleOpen}
          onMouseEnter={isHover ? handleOpen : undefined}
          onMouseLeave={isHover ? scheduleClose : undefined}
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

      {/* Primary Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        autoFocus={false}
        disableAutoFocusItem
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        hideBackdrop={isHover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal,
        }}
        slotProps={{
          list: {
            autoFocus: false,
          },
          root: isHover
            ? {
                sx: { pointerEvents: "none" },
              }
            : undefined,
          paper: {
            sx: [
              {
                pointerEvents: "auto",
                minWidth: 160,
                borderRadius: `${tokens.radiusLg}px`,
                border: `1px solid ${tokens.borderDefault}`,
                bgcolor: tokens.bgElevated,
                boxShadow: tokens.shadowPopover,
                p: 0.75,
              },
              ...(Array.isArray(menuSx) ? menuSx : menuSx ? [menuSx] : []),
            ],
            onMouseEnter: isHover ? clearCloseTimer : undefined,
            onMouseLeave: isHover ? scheduleClose : undefined,
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

          const hasChildren = Boolean(item.children && item.children.length > 0);
          const isDanger = item.danger || item.variant === "danger" || item.variant === "destructive";

          const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasChildren) {
              e.preventDefault();
              // Parent items with children should not close or navigate
              setSubAnchorEl(e.currentTarget as HTMLElement);
              setActiveSubItem(item);
              return;
            }
            handleClose();
            if (item.action) item.action();
            else if (item.onClick) item.onClick();
          };

          const handleItemMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
            clearCloseTimer();
            if (hasChildren) {
              setSubAnchorEl(e.currentTarget);
              setActiveSubItem(item);
            } else {
              setSubAnchorEl(null);
              setActiveSubItem(null);
            }
          };

          return (
            <React.Fragment key={index}>
              {item.divider && <Divider sx={{ my: 0.5, borderColor: tokens.borderDefault }} />}
              <MenuItem
                {...(!hasChildren && item.href
                  ? ({ component: NextLink, href: item.href, target: item.target } as any)
                  : {})}
                onClick={handleClick}
                onMouseEnter={isHover ? handleItemMouseEnter : undefined}
                disabled={item.disabled}
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: `${tokens.radiusPill}px`,
                  py: 0.8,
                  px: 1.75,
                  my: 0.25,
                  gap: 1.25,
                  transition: "all 0.15s ease",
                  color: isDanger ? tokens.danger : tokens.textPrimary,
                  "&:hover": {
                    bgcolor: isDanger ? tokens.dangerSubtle : tokens.bgSubtle,
                  },
                }}
              >
                {/* For right-aligned nested menus: show left chevron first */}
                {hasChildren && isRight && (
                  <ChevronLeftRoundedIcon sx={{ fontSize: 16, color: "text.secondary", ml: -0.5, mr: 0.5 }} />
                )}

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

                {/* For left-aligned nested menus: show right chevron at end */}
                {hasChildren && !isRight && (
                  <ChevronRightRoundedIcon sx={{ fontSize: 16, color: "text.secondary", ml: "auto" }} />
                )}
              </MenuItem>
            </React.Fragment>
          );
        })}
      </Menu>

      {/* Cascading Submenu */}
      {Boolean(activeSubItem?.children?.length) && (
        <Menu
          anchorEl={subAnchorEl}
          open={Boolean(subAnchorEl && activeSubItem?.children?.length)}
          onClose={handleClose}
          disableScrollLock
          autoFocus={false}
          disableAutoFocusItem
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          hideBackdrop={isHover}
          anchorOrigin={{
            vertical: "top",
            horizontal: isRight ? "left" : "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: isRight ? "right" : "left",
          }}
          slotProps={{
            list: {
              autoFocus: false,
            },
            root: isHover
              ? {
                  sx: { pointerEvents: "none" },
                }
              : undefined,
            paper: {
              sx: [
                {
                  pointerEvents: "auto",
                  minWidth: 170,
                  borderRadius: `${tokens.radiusLg}px`,
                  border: `1px solid ${tokens.borderDefault}`,
                  bgcolor: tokens.bgElevated,
                  boxShadow: tokens.shadowPopover,
                  p: 0.75,
                },
                ...(Array.isArray(menuSx) ? menuSx : menuSx ? [menuSx] : []),
              ],
              onMouseEnter: isHover ? clearCloseTimer : undefined,
              onMouseLeave: isHover ? scheduleClose : undefined,
            },
          }}
        >
          {activeSubItem?.children?.map((sub, sIdx) => {
            if (sub === "divider") {
              return <Divider key={`sub-div-${sIdx}`} sx={{ my: 0.5, borderColor: tokens.borderDefault }} />;
            }

            const isDanger = sub.danger || sub.variant === "danger" || sub.variant === "destructive";
            const handleSubClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              handleClose();
              if (sub.action) sub.action();
              else if (sub.onClick) sub.onClick();
            };

            return (
              <React.Fragment key={sIdx}>
                {sub.divider && <Divider sx={{ my: 0.5, borderColor: tokens.borderDefault }} />}
                <MenuItem
                  {...(sub.href ? ({ component: NextLink, href: sub.href, target: sub.target } as any) : {})}
                  onClick={handleSubClick}
                  disabled={sub.disabled}
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: `${tokens.radiusPill}px`,
                    py: 0.8,
                    px: 1.75,
                    my: 0.25,
                    gap: 1.25,
                    transition: "all 0.15s ease",
                    color: isDanger ? tokens.danger : tokens.textPrimary,
                    "&:hover": {
                      bgcolor: isDanger ? tokens.dangerSubtle : tokens.bgSubtle,
                    },
                  }}
                >
                  {sub.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: "auto",
                        color: isDanger ? tokens.danger : "text.secondary",
                        "& .MuiSvgIcon-root": { fontSize: 18 },
                      }}
                    >
                      {sub.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={sub.label}
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
      )}
    </>
  );
}

export default Dropdown;
