"use client";

import * as React from "react";
import MuiTable, { type TableProps as MuiTableProps } from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableContainer, { type TableContainerProps as MuiTableContainerProps } from "@mui/material/TableContainer";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableFooter from "@mui/material/TableFooter";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { tokens } from "@/theme/theme";

const TableContainerContext = React.createContext(false);

function TableContainer({ sx, children, ...props }: MuiTableContainerProps) {
  return (
    <TableContainerContext.Provider value={true}>
      <MuiTableContainer
        sx={[
          {
            width: "100%",
            overflowX: "auto",
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      >
        {children}
      </MuiTableContainer>
    </TableContainerContext.Provider>
  );
}

function Table({ sx, ...props }: MuiTableProps) {
  const insideContainer = React.useContext(TableContainerContext);

  const tableEl = (
    <MuiTable
      sx={[
        {
          fontSize: "0.86rem",
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          captionSide: "bottom",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );

  if (insideContainer) {
    return tableEl;
  }

  return (
    <MuiTableContainer
      sx={{
        width: "100%",
        borderRadius: `${tokens.radiusMd}px`,
        border: `1px solid ${tokens.borderDefault}`,
        overflowX: "auto",
      }}
    >
      {tableEl}
    </MuiTableContainer>
  );
}

function TableHead({ sx, ...props }: React.ComponentProps<typeof MuiTableHead>) {
  return (
    <MuiTableHead
      sx={[
        {
          bgcolor: tokens.bgSubtle,
          "& .MuiTableCell-root": {
            borderBottom: `1px solid ${tokens.borderDefault}`,
            color: tokens.textSecondary,
            fontWeight: 600,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

const TableHeader = TableHead;

function TableBody({ sx, ...props }: React.ComponentProps<typeof MuiTableBody>) {
  return <MuiTableBody sx={sx} {...props} />;
}

function TableFooter({ sx, ...props }: React.ComponentProps<typeof MuiTableFooter>) {
  return (
    <MuiTableFooter
      sx={[
        {
          bgcolor: tokens.bgSubtle,
          "& .MuiTableCell-root": {
            borderTop: `1px solid ${tokens.borderDefault}`,
            fontWeight: 600,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

function TableRow({ sx, ...props }: React.ComponentProps<typeof MuiTableRow>) {
  return (
    <MuiTableRow
      sx={[
        {
          transition: "background-color 0.15s ease",
          "&:last-child td, &:last-child th": { borderBottom: 0 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

function TableCell({ sx, ...props }: React.ComponentProps<typeof MuiTableCell>) {
  return (
    <MuiTableCell
      sx={[
        {
          px: 2,
          py: 1.5,
          verticalAlign: "middle",
          color: tokens.textPrimary,
          borderBottom: `1px solid ${tokens.borderDefault}`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

function TableCaption({ sx, ...props }: React.ComponentProps<"caption"> & { sx?: MuiTableProps["sx"] }) {
  return (
    <Box
      component='caption'
      sx={{
        mt: 2,
        fontSize: "0.85rem",
        color: tokens.textSecondary,
        ...sx,
      }}
      {...props}
    />
  );
}

export {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
