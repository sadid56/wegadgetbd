"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import { useQueryState, parseAsInteger } from "nuqs";
import Box from "@mui/material/Box";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Dropdown } from "@/components/ui/dropdown";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";

import { useAdminProducts, useDeleteProduct, useUpdateProduct, type Product } from "@/query-client/products";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

function StatusChip({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return <Badge variant='success'>{status}</Badge>;
  }
  if (status === "PENDING") {
    return <Badge variant='secondary'>{status}</Badge>;
  }
  return <Badge variant='outline'>{status}</Badge>;
}

export default function AdminProductsPage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rowsPerPage, setRowsPerPage] = useQueryState("limit", parseAsInteger.withDefault(10));

  const { data, isLoading } = useAdminProducts({
    search: search.trim() || undefined,
    page,
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
            <Avatar
              src={getAssetUrl(product.images[0])}
              alt={product.title}
              variant="rounded"
              sx={{ width: 40, height: 40, borderRadius: "6px" }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: 40, height: 40, borderRadius: "6px", bgcolor: "action.hover" }}
            >
              {" "}
            </Avatar>
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
            <Badge variant='secondary'>{product.brand}</Badge>
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
          <Dropdown
            title='Actions'
            items={[
              {
                label: "Edit",
                icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
                href: `/admin/products/${product.id}/edit`,
              },
              {
                label: "View Public",
                icon: <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />,
                href: `/products/${product.slug}`,
                target: "_blank",
              },
              "divider",
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setProductToDelete(product.id),
              },
            ]}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setSearch(e.target.value || null);
            setPage(1);
          }}
          startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
        />
      </Box>

      <DataTable
        columns={columns}
        data={data?.products ?? []}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyMessage='No products found.'
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={data?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
      />

      <AlertDialog
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title='Move Product to Trash?'
        description='This will move the product to Trash. You can restore it anytime or delete it permanently from the Trash.'
        confirmText='Move to Trash'
        confirmVariant='destructive'
      />
    </Box>
  );
}
