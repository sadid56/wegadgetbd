"use client";

import * as React from "react";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableContainer from "@mui/material/TableContainer";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import MuiTablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { type SxProps, type Theme } from "@mui/material/styles";
import { tokens } from "@/theme/theme";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  accessorKey?: keyof T;
  align?: "left" | "center" | "right" | "inherit" | "justify";
  width?: number | string;
  minWidth?: number | string;
  headSx?: SxProps<Theme>;
  cellSx?: SxProps<Theme>;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T) => void;
  hover?: boolean;
  size?: "small" | "medium";
  stickyHeader?: boolean;
  containerSx?: SxProps<Theme>;
  tableSx?: SxProps<Theme>;
  // Pagination (powered natively by MUI TablePagination)
  pagination?: boolean;
  page?: number; // 0-based
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rowsPerPageOptions?: (number | { value: number; label: string })[];
  paginationSx?: SxProps<Theme>;
}

const defaultHeadSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 600,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  bgcolor: "action.hover",
  borderBottom: "1px solid",
  borderColor: "divider",
  py: 1.25,
  whiteSpace: "nowrap",
};

const defaultCellSx: SxProps<Theme> = {
  borderBottom: "1px solid",
  borderColor: "divider",
  py: 1.5,
  fontSize: 14,
  color: "text.primary",
};

export function DataTable<T>({
  columns,
  data = [],
  keyExtractor,
  isLoading = false,
  emptyMessage = "No records found.",
  onRowClick,
  hover = true,
  size = "medium",
  stickyHeader = false,
  containerSx,
  tableSx,
  pagination = true,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  paginationSx,
}: DataTableProps<T>) {
  const isServerPaginated = onPageChange !== undefined;
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(rowsPerPage ?? 10);

  const currentPage = isServerPaginated ? (page ?? 0) : internalPage;
  const currentRowsPerPage = isServerPaginated ? (rowsPerPage ?? 10) : internalRowsPerPage;

  const count = totalCount ?? data.length;

  const displayedData = React.useMemo(() => {
    if (isServerPaginated || !pagination) return data;
    const start = currentPage * currentRowsPerPage;
    return data.slice(start, start + currentRowsPerPage);
  }, [data, isServerPaginated, pagination, currentPage, currentRowsPerPage]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if (isServerPaginated) {
      onPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const nextLimit = parseInt(event.target.value, 10);
    if (isServerPaginated) {
      onRowsPerPageChange?.(event);
    } else {
      setInternalRowsPerPage(nextLimit);
      setInternalPage(0);
    }
  };

  return (
    <Box
      sx={[
        {
          width: "100%",
          borderRadius: `${tokens.radiusMd}px`,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        },
        ...(Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : []),
      ]}
    >
      <MuiTableContainer sx={{ width: "100%", overflowX: "auto" }}>
        <MuiTable size={size} stickyHeader={stickyHeader} sx={tableSx}>
          <MuiTableHead>
            <MuiTableRow>
              {columns.map((column) => (
                <MuiTableCell
                  key={column.id}
                  align={column.align ?? "left"}
                  sx={[
                    defaultHeadSx,
                    column.width ? { width: column.width } : {},
                    column.minWidth ? { minWidth: column.minWidth } : {},
                    ...(Array.isArray(column.headSx) ? column.headSx : column.headSx ? [column.headSx] : []),
                  ]}
                >
                  {column.header}
                </MuiTableCell>
              ))}
            </MuiTableRow>
          </MuiTableHead>

          <MuiTableBody>
            {isLoading ? (
              <MuiTableRow>
                <MuiTableCell
                  colSpan={columns.length}
                  sx={{
                    height: 140,
                    textAlign: "center",
                    borderBottom: "none",
                  }}
                >
                  <CircularProgress size={28} sx={{ color: "primary.main" }} />
                </MuiTableCell>
              </MuiTableRow>
            ) : displayedData.length === 0 ? (
              <MuiTableRow>
                <MuiTableCell
                  colSpan={columns.length}
                  sx={{
                    height: 120,
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: 14,
                    borderBottom: "none",
                  }}
                >
                  {emptyMessage}
                </MuiTableCell>
              </MuiTableRow>
            ) : (
              displayedData.map((row, index) => {
                const key = keyExtractor ? keyExtractor(row, index) : ((row as any).id ?? index);

                return (
                  <MuiTableRow
                    key={key}
                    hover={hover}
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:hover": hover ? { bgcolor: "action.hover" } : undefined,
                      "&:last-child td": {
                        borderBottom: pagination ? undefined : "none",
                      },
                    }}
                  >
                    {columns.map((column) => {
                      const value = column.cell
                        ? column.cell(row, index)
                        : column.accessorKey
                        ? (row[column.accessorKey] as React.ReactNode)
                        : null;

                      return (
                        <MuiTableCell
                          key={column.id}
                          align={column.align ?? "left"}
                          sx={[
                            defaultCellSx,
                            column.width ? { width: column.width } : {},
                            column.minWidth ? { minWidth: column.minWidth } : {},
                            ...(Array.isArray(column.cellSx) ? column.cellSx : column.cellSx ? [column.cellSx] : []),
                          ]}
                        >
                          {value}
                        </MuiTableCell>
                      );
                    })}
                  </MuiTableRow>
                );
              })
            )}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>

      {pagination && (
        <MuiTablePagination
          component="div"
          count={count}
          page={count > 0 && currentPage * currentRowsPerPage >= count ? 0 : currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={currentRowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={[
            {
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              color: "text.secondary",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 13,
                color: "text.secondary",
              },
              "& .MuiTablePagination-actions": {
                "& .MuiIconButton-root": {
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                  "&.Mui-disabled": { opacity: 0.4 },
                },
              },
            },
            ...(Array.isArray(paginationSx) ? paginationSx : paginationSx ? [paginationSx] : []),
          ]}
        />
      )}
    </Box>
  );
}

