"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Modal,
  ModalTitle,
  ModalContent,
  Badge,
  Select,
  MenuItem,
  Divider,
} from "@/components/ui";
import { FormControl } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";
import CloseIcon from "@mui/icons-material/Close";

import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

import { format } from "date-fns";
import { orderStatusEnum, type OrderStatus } from "@/db/schema";
import { parseDevice } from "@/lib/parse-device";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import type { AdminOrderItem } from "./orders-client";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrderItem | null;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}

const infoRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  fontSize: 14,
  color: "text.primary",
} as const;

const sectionTitleSx = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "text.secondary",
  mb: 1.5,
} as const;

export function OrderDetailsModal({ open, onOpenChange, order, onStatusChange }: OrderDetailsModalProps) {
  if (!order) return null;

  const items = (order.items || []) as Array<{
    id: string;
    productTitle: string;
    price: number;
    quantity: number;
    image?: string | null;
    [key: string]: unknown;
  }>;
  const device = parseDevice(order.userAgent as string | undefined);
  const deviceLabel = `${device.os || ""} ${device.browser || ""} (${device.device})`.trim() || "Unknown Device";

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='md'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: { xs: "100%", sm: 768 },
            maxHeight: { xs: "100dvh", sm: "90vh" },
          },
        },
      }}
    >
      {/* Header */}
      <ModalTitle sx={{ pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography
            component='h2'
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Order Details
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size='small' sx={{ minWidth: { xs: 120, sm: 140 } }}>
              <Select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              >
                {orderStatusEnum.enumValues.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton
              size='small'
              aria-label='Close'
              onClick={() => onOpenChange(false)}
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                color: "text.secondary",
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </ModalTitle>

      <ModalContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          {/* Customer info + Order stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 3,
            }}
          >
            {/* Customer info */}
            <Box>
              <Typography sx={sectionTitleSx}>Customer info</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={infoRowSx}>
                  <PersonOutlineIcon sx={{ fontSize: 16, color: tokens.primary }} />
                  <Box component='span' sx={{ fontWeight: 600 }}>
                    {order.customerName}
                  </Box>
                </Box>
                <Box sx={infoRowSx}>
                  <PhoneOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                  <Box component='span'>{order.phoneNumber}</Box>
                </Box>
                <Box sx={{ ...infoRowSx, alignItems: "flex-start" }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 16, color: tokens.primary, mt: "2px" }} />
                  <Box component='span'>
                    {order.address}
                    {order.city && <>, {order.city}</>}
                    {order.area && <>, {order.area}</>}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Order stats */}
            <Box>
              <Typography sx={sectionTitleSx}>Order stats</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={infoRowSx}>
                  <ScheduleIcon sx={{ fontSize: 16, color: tokens.primary }} />
                  <Box component='span'>{format(new Date(order.createdAt), "PPP p")}</Box>
                </Box>
                <Box sx={{ ...infoRowSx, flexWrap: "wrap" }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                  <Box component='span' sx={{ fontWeight: 700, color: tokens.textPrimary }}>
                    ৳{Number(order.totalAmount).toLocaleString()}
                  </Box>
                  <Badge variant='outline' sx={{ ml: 1 }}>
                    {(order.paymentMethod || "COD").replace(/_/g, " ")}
                  </Badge>
                </Box>
                <Box sx={infoRowSx}>
                  <MonitorOutlinedIcon sx={{ fontSize: 20, color: tokens.primary }} />
                  <Box
                    component='span'
                    title={String(order.userAgent || "")}
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {deviceLabel}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Products table */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <LocalMallOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
              <Typography component='h3' sx={{ ...sectionTitleSx, mb: 0 }}>
                Order items
              </Typography>
            </Box>

            <Box
              sx={{
                borderRadius: `${tokens.radiusMd}px`,
                border: "1px solid",
                borderColor: tokens.borderDefault,
                overflowX: "auto",
              }}
            >
              <Box
                component='table'
                sx={{
                  width: "100%",
                  fontSize: { xs: 12.5, sm: 14 },
                  textAlign: "left",
                  borderCollapse: "collapse",
                }}
              >
                <Box
                  component='thead'
                  sx={{
                    bgcolor: tokens.bgSubtle,
                    borderBottom: "1px solid",
                    borderColor: tokens.borderDefault,
                  }}
                >
                  <Box component='tr'>
                    {[
                      { label: "Item", align: "left" },
                      { label: "Price", align: "left" },
                      { label: "Qty", align: "left" },
                      { label: "Total", align: "right" },
                    ].map((h) => (
                      <Box
                        key={h.label}
                        component='th'
                        sx={{
                          px: { xs: 1.25, sm: 2 },
                          py: 1,
                          fontWeight: 700,
                          textAlign: h.align,
                          fontSize: { xs: 12, sm: 13 },
                          color: "text.primary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.label}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box component='tbody'>
                  {items.map((item, idx) => (
                    <Box
                      key={idx}
                      component='tr'
                      sx={{
                        bgcolor: tokens.bgPanel,
                        borderBottom: idx < items.length - 1 ? "1px solid" : "none",
                        borderColor: tokens.borderDefault,
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: tokens.bgSubtle },
                      }}
                    >
                      <Box component='td' sx={{ px: { xs: 1.25, sm: 2 }, py: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {Boolean(item.image) && (
                            <Box
                              component='img'
                              src={getAssetUrl(String(item.image))}
                              alt={String(item.title || "")}
                              sx={{
                                height: 32,
                                width: 32,
                                objectFit: "contain",
                                borderRadius: `${tokens.radiusSm}px`,
                                border: "1px solid",
                                borderColor: tokens.borderDefault,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                            {String(item.title || "")}
                          </Box>
                        </Box>
                      </Box>
                      <Box component='td' sx={{ px: { xs: 1.25, sm: 2 }, py: 1.5, color: "text.primary", whiteSpace: "nowrap" }}>
                        ৳{Number(item.price).toLocaleString()}
                      </Box>
                      <Box component='td' sx={{ px: { xs: 1.25, sm: 2 }, py: 1.5, color: "text.primary", whiteSpace: "nowrap" }}>
                        ×{Number(item.qty || 1)}
                      </Box>
                      <Box
                        component='td'
                        sx={{
                          px: { xs: 1.25, sm: 2 },
                          py: 1.5,
                          textAlign: "right",
                          fontWeight: 700,
                          color: "text.primary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ৳{(Number(item.price) * Number(item.qty || 1)).toLocaleString()}
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box component='tfoot' sx={{ bgcolor: tokens.bgSubtle, fontWeight: 700 }}>
                  <Box component='tr'>
                    <Box
                      component='td'
                      colSpan={3}
                      sx={{
                        px: 2,
                        py: 1,
                        textAlign: "right",
                        fontWeight: 700,
                        color: "text.primary",
                      }}
                    >
                      Grand Total:
                    </Box>
                    <Box
                      component='td'
                      sx={{
                        px: 2,
                        py: 1,
                        textAlign: "right",
                        color: tokens.textPrimary,
                        fontWeight: 700,
                      }}
                    >
                      ৳{Number(order.totalAmount).toLocaleString()}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Additional info */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 3,
            }}
          >
            {order.notes && (
              <Box>
                <Typography
                  component='h4'
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  Admin Notes
                </Typography>
                <Box
                  sx={{
                    borderRadius: `${tokens.radiusSm}px`,
                    bgcolor: tokens.warningSubtle,
                    p: 1.5,
                    fontSize: 12,
                    fontStyle: "italic",
                    color: tokens.warningHover,
                    lineHeight: 1.5,
                  }}
                >
                  {order.notes}
                </Box>
              </Box>
            )}

            {order.whatsappMessage && (
              <Box>
                <Box
                  component='h4'
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "text.secondary",
                    m: 0,
                    mb: 1,
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 12 }} />
                  Whatsapp preview
                </Box>
                <Box
                  sx={{
                    borderRadius: `${tokens.radiusSm}px`,
                    bgcolor: tokens.accentLight,
                    p: 1.5,
                    fontSize: 10,
                    lineHeight: 1.65,
                    color: tokens.successText,
                    whiteSpace: "pre-wrap",
                    maxHeight: 128,
                    overflowY: "auto",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {order.whatsappMessage}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </ModalContent> 
    </Modal>
  );
}
