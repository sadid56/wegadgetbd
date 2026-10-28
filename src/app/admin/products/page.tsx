"use client";

import { useState } from "react";
import NextLink from "next/link";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";

import { useAdminProducts, useDeleteProduct, useUpdateProduct } from "@/query-client/products";

const tableHeadSx = {
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
} as const;

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: 14,
  borderRadius: "8px",
  height: 40,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  boxShadow: "none",
  "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
} as const;

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
  const { data, isLoading } = useAdminProducts({ search, limit: 100 });
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuProductId, setMenuProductId] = useState<string | null>(null);

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

  const openMenu = (e: React.MouseEvent<HTMLElement>, productId: string) => {
    setMenuAnchor(e.currentTarget);
    setMenuProductId(productId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuProductId(null);
  };

  const activeProduct = menuProductId ? data?.products.find((p) => p.id === menuProductId) : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Products
        </Typography>
        <Button
          component={NextLink}
          href='/admin/products/new'
          variant='contained'
          disableElevation
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={primaryButtonSx}
        >
          Add Product
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative", flex: 1, maxWidth: 384 }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "text.secondary",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <InputBase
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              height: 40,
              pl: "32px",
              pr: 1.5,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              fontSize: 14,
              transition: "border-color 200ms",
              "& input::placeholder": { color: "text.secondary", opacity: 1 },
              "&.Mui-focused": { borderColor: "primary.main" },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...tableHeadSx, width: 80 }}>Image</TableCell>
              <TableCell sx={tableHeadSx}>Name</TableCell>
              <TableCell sx={tableHeadSx}>Brand</TableCell>
              <TableCell sx={tableHeadSx}>Category</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={tableHeadSx}>Label</TableCell>
              <TableCell sx={tableHeadSx}>Featured</TableCell>
              <TableCell sx={tableHeadSx}>Price</TableCell>
              <TableCell sx={tableHeadSx}>Updated</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : !data || data.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              data.products.map((product) => {
                const toggleFeatured = () => {
                  updateProduct({
                    id: product.id,
                    data: { isFeatured: !product.isFeatured },
                  });
                };

                return (
                  <TableRow
                    key={product.id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      "& td": {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell>
                      {product.images?.[0] ? (
                        <Box
                          component='img'
                          src={product.images[0]}
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
                      )}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>
                      {product.title}
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
                    </TableCell>

                    <TableCell>
                      {product.brand ? (
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
                      )}
                    </TableCell>

                    <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{product.category?.name}</TableCell>

                    <TableCell>
                      <StatusChip status={product.status} />
                    </TableCell>

                    <TableCell>
                      {product.label !== "NONE" && (
                        <Chip
                          label={product.label?.replace("_", " ")}
                          size='small'
                          variant='outlined'
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: "rgba(59,130,246,0.1)",
                            color: "primary.main",
                            borderColor: "rgba(59,130,246,0.2)",
                            "& .MuiChip-label": { px: 1.25 },
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        size='small'
                        onClick={toggleFeatured}
                        aria-label='Toggle featured'
                        sx={{
                          width: 32,
                          height: 32,
                          color: product.isFeatured ? "#eab308" : "text.secondary",
                          "&:hover": {
                            color: product.isFeatured ? "#ca8a04" : "text.primary",
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <StarIcon
                          sx={{
                            fontSize: 16,
                            fill: product.isFeatured ? "#eab308" : "none",
                          }}
                        />
                      </IconButton>
                    </TableCell>

                    <TableCell sx={{ color: "text.primary" }}>
                      {product.discountPrice ? (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box component='span' sx={{ fontWeight: 700 }}>
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
                        <Box component='span'>৳{product.price.toString()}</Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
                        {dateTimeFormatter.format(new Date(product.updatedAt))}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton
                        size='small'
                        onClick={(e) => openMenu(e, product.id)}
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row actions menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 180,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              py: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 0.75 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Actions
          </Typography>
        </Box>
        {activeProduct && (
          <MenuItem
            component={NextLink}
            href={`/admin/products/${activeProduct.id}/edit`}
            onClick={closeMenu}
            sx={{ fontSize: 14, py: 1, gap: 1, color: "text.primary", textDecoration: "none" }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            Edit
          </MenuItem>
        )}
        {activeProduct && (
          <MenuItem
            component={NextLink}
            href={`/products/${activeProduct.slug}`}
            target='_blank'
            onClick={closeMenu}
            sx={{ fontSize: 14, py: 1, gap: 1, color: "text.primary", textDecoration: "none" }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            View Public
          </MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            if (menuProductId) setProductToDelete(menuProductId);
            closeMenu();
          }}
          sx={{
            fontSize: 14,
            py: 1,
            gap: 1,
            color: "error.main",
            "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete confirmation */}
      <Dialog
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            This action cannot be undone. This will permanently delete the product from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setProductToDelete(null)}
            variant='outlined'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              bgcolor: "#dc2626",
              color: "#fff",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
