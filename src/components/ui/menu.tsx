"use client";

import * as React from "react";
import MuiMenu, { type MenuProps as MuiMenuProps } from "@mui/material/Menu";
import { MenuItem, type MenuItemProps } from "./select";
import { tokens } from "@/theme/theme";

export type MenuProps = MuiMenuProps;
export { MenuItem, type MenuItemProps };

export function Menu({ slotProps, sx, disableScrollLock = true, ...props }: MenuProps) {
  const paperProps = (slotProps?.paper as Record<string, any>) ?? {};
  const listProps = (slotProps?.list as Record<string, any>) ?? {};

  return (
    <MuiMenu
      disableScrollLock={disableScrollLock}
      slotProps={{
        ...slotProps,
        list: {
          ...listProps,
          sx: [
            { p: 1 },
            ...(Array.isArray(listProps.sx)
              ? listProps.sx
              : listProps.sx
              ? [listProps.sx]
              : []),
          ],
        },
        paper: {
          ...paperProps,
          sx: [
            {
              bgcolor: tokens.bgPanel,
              color: tokens.textPrimary,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: `${tokens.radiusLg}px`,
              boxShadow: tokens.shadowPopover,
              mt: 1,
            },
            ...(Array.isArray(paperProps.sx)
              ? paperProps.sx
              : paperProps.sx
              ? [paperProps.sx]
              : []),
          ],
        },
      }}
      sx={sx}
      {...props}
    />
  );
}

export default Menu;
