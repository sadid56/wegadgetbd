"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useQueryState, parseAsInteger } from "nuqs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InputBase } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dropdown } from "@/components/ui/dropdown";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useUsers } from "@/query-client/users";

export default function UsersPage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rowsPerPage, setRowsPerPage] = useQueryState("limit", parseAsInteger.withDefault(10));

  const { data, isLoading } = useUsers({
    search: search.trim() || undefined,
    page,
    limit: rowsPerPage,
  });

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: (user) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar
              src={user.image || undefined}
              alt={user.name || "User"}
              sx={{ width: 32, height: 32, fontSize: "0.75rem" }}
            >
              {user.name ? user.name[0]?.toUpperCase() : "?"}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
              {user.name || "Anonymous"}
            </Typography>
          </Box>
        ),
      },
      {
        id: "email",
        header: "Email",
        cell: (user) => (
          <Box component='span' sx={{ fontSize: 14, color: "text.primary" }}>
            {user.email}
          </Box>
        ),
      },
      {
        id: "role",
        header: "Role",
        cell: (user) => (
          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
            {user.role}
          </Badge>
        ),
      },
      {
        id: "joined",
        header: "Joined",
        cell: (user) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
            {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "—"}
          </Box>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (user) =>
          user.banned ? (
            <Badge variant='danger'>Banned</Badge>
          ) : (
            <Badge variant='success'>Active</Badge>
          ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (user) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "View Details",
                icon: <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />,
                href: `/admin/users/${user.id}`,
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title='Users'
        description='Manage registered users, their roles, and account status.'
      />

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 384 }}>
        <InputBase
          placeholder='Search users...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value || null);
            setPage(1);
          }}
          startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
        />
      </Box>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={data?.users ?? []}
        keyExtractor={(user) => user.id}
        isLoading={isLoading}
        emptyMessage='No users found.'
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={data?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
      />
    </Box>
  );
}
