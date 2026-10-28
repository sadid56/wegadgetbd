"use client";

import * as React from "react";
import MuiTable, { type TableProps as MuiTableProps } from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableContainer from "@mui/material/TableContainer";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableFooter from "@mui/material/TableFooter";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";

function Table({ sx, ...props }: MuiTableProps) {
  return (
    <MuiTableContainer
      sx={{
        width: "100%",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        overflowX: "auto",
      }}
    >
      <MuiTable
        sx={{
          fontSize: "0.86rem",
          bgcolor: "background.paper",
          color: "text.primary",
          captionSide: "bottom",
          ...sx,
        }}
        {...props}
      />
    </MuiTableContainer>
  );
}

function TableHeader({ sx, ...props }: React.ComponentProps<typeof MuiTableHead>) {
  return (
    <MuiTableHead
      sx={{
        bgcolor: "action.hover",
        "& .MuiTableCell-root": {
          borderBottom: 1,
          borderColor: "divider",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function TableBody({ sx, ...props }: React.ComponentProps<typeof MuiTableBody>) {
  return <MuiTableBody sx={{ ...sx }} {...props} />;
}

function TableFooter({ sx, ...props }: React.ComponentProps<typeof MuiTableFooter>) {
  return (
    <MuiTableFooter
      sx={{
        bgcolor: "action.hover",
        "& .MuiTableCell-root": {
          borderTop: 1,
          borderColor: "divider",
          fontWeight: 600,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function TableRow({ sx, ...props }: React.ComponentProps<typeof MuiTableRow>) {
  return (
    <MuiTableRow
      sx={{
        transition: "background-color 0.15s ease",
        "&:last-child td, &:last-child th": { borderBottom: 0 },
        ...sx,
      }}
      {...props}
    />
  );
}

function TableHead({ sx, ...props }: React.ComponentProps<typeof MuiTableCell>) {
  return (
    <MuiTableCell
      component='th'
      sx={{
        height: 44,
        px: 2,
        textAlign: "left",
        verticalAlign: "middle",
        fontWeight: 600,
        color: "text.secondary",
        whiteSpace: "nowrap",
        borderBottom: 1,
        borderColor: "divider",
        ...sx,
      }}
      {...props}
    />
  );
}

function TableCell({ sx, ...props }: React.ComponentProps<typeof MuiTableCell>) {
  return (
    <MuiTableCell
      sx={{
        px: 2,
        py: 1.5,
        verticalAlign: "middle",
        color: "text.primary",
        whiteSpace: "nowrap",
        borderBottom: 1,
        borderColor: "divider",
        ...sx,
      }}
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
        color: "text.secondary",
        ...sx,
      }}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
