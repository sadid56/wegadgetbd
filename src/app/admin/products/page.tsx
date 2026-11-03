"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { Chip } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";

import { useAdminProducts, useDeleteProduct, useUpdateProduct, type Product } from "@/query-client/products";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

function StatusChip({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return (
      <Chip
        label={status}
        size='small'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  if (status === "PENDING") {
    return (
      <Chip
        label={status}
        size='small'
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 700,
          bgcolor: "action.hover",
          color: "text.primary",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    );
  }
  return (
    <Chip
      label={status}
      size='small'
      variant='outlined'
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 700,
        borderColor: "divider",
        color: "text.primary",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useAdminProducts({
    search: search.trim() || undefined,
    page: page + 1,
    limit: rowsPerPage,
  });

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const dateTimeFormatter = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        id: "image",
        header: "Image",
        width: 80,
        cell: (product) =>
          product.images?.[0] ? (
            <Box
              component='img'
              src={getAssetUrl(product.images[0])}
              alt={product.title}
              sx={{
                height: 40,
                width: 40,
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 40,
                width: 40,
                borderRadius: "6px",
                bgcolor: "action.hover",
              }}
            />
          ),
      },
      {
        id: "name",
        header: "Name",
        cell: (product) => (
          <Box>
            <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
              {product.title}
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                fontSize: 12,
                color: "text.secondary",
                mt: 0.25,
              }}
            >
              {product.slug}
            </Box>
          </Box>
        ),
      },
      {
        id: "brand",
        header: "Brand",
        cell: (product) =>
          product.brand ? (
            <Chip
              label={product.brand}
              size='small'
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                bgcolor: "action.hover",
                color: "text.primary",
                "& .MuiChip-label": { px: 1.25 },
              }}
            />
          ) : (
            <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
              Not set
            </Box>
          ),
      },
      {
        id: "category",
        header: "Category",
        cell: (product) => (
          <Box component='span' sx={{ fontSize: 14, color: "text.primary" }}>
            {product.category?.name ?? "—"}
          </Box>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (product) => <StatusChip status={product.status} />,
      },
      {
        id: "featured",
        header: "Featured",
        cell: (product) => (
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              updateProduct({
                id: product.id,
                data: { isFeatured: !product.isFeatured },
              });
            }}
            aria-label='Toggle featured'
            sx={{
              width: 32,
              height: 32,
              color: product.isFeatured ? tokens.warning : "text.secondary",
              "&:hover": {
                color: product.isFeatured ? tokens.warningHover : "text.primary",
                bgcolor: "action.hover",
              },
            }}
          >
            <StarIcon
              sx={{
                fontSize: 16,
                fill: product.isFeatured ? tokens.warning : "none",
              }}
            />
          </IconButton>
        ),
      },
      {
        id: "price",
        header: "Price",
        cell: (product) =>
          product.discountPrice ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box component='span' sx={{ fontWeight: 700, color: "text.primary" }}>
                ৳{product.discountPrice.toString()}
              </Box>
              <Box
                component='span'
                sx={{
                  fontSize: 12,
                  textDecoration: "line-through",
                  color: "text.secondary",
                  mt: 0.25,
                }}
              >
                ৳{product.price.toString()}
              </Box>
            </Box>
          ) : (
            <Box component='span' sx={{ color: "text.primary" }}>
              ৳{product.price.toString()}
            </Box>
          ),
      },
      {
        id: "updated",
        header: "Updated",
        cell: (product) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
            {dateTimeFormatter.format(new Date(product.updatedAt))}
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (product) => (
          <DropdownMenu
            trigger={
              <IconButton
                size='small'
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
            }
            align='right'
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem component={NextLink} href={`/admin/products/${product.id}/edit`}>
              <EditOutlinedIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem component={NextLink} href={`/products/${product.slug}`} target='_blank'>
              <VisibilityOutlinedIcon />
              View Public
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant='destructive'
              onClick={() => setProductToDelete(product.id)}
            >
              <DeleteOutlineIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
        ),
      },
    ],
    [dateTimeFormatter],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Reusable Dashboard Header */}
      <DashboardHeader
        title='Products'
        action={
          <Button component={NextLink} href='/admin/products/new' variant='primary' startIcon={<AddIcon sx={{ fontSize: 16 }} />}>
            Add Product
          </Button>
        }
      />

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 384 }}>
        <InputBase
          placeholder='Search products...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
        />
      </Box>

      {/* Reusable DataTable with native MUI Table & TablePagination */}
      <DataTable
        columns={columns}
        data={data?.products ?? []}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyMessage='No products found.'
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={data?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Reusable Alert Dialog for Confirmation */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      >
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
