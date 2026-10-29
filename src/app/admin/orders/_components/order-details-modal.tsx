"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

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

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}

const ORANGE = "#f97316";
const ORANGE_DARK = "#ea580c";

const infoRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  fontSize: 14,
  color: "text.primary",
} as const;

const sectionTitleSx = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "text.secondary",
  mb: 1.5,
} as const;

export function OrderDetailsModal({ open, onOpenChange, order, onStatusChange }: OrderDetailsModalProps) {
  if (!order) return null;

  const items = order.items as any[];
  const device = parseDevice(order.userAgent);
  const deviceLabel = `${device.os || ""} ${device.browser || ""} (${device.device})`.trim() || "Unknown Device";

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='md'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: 768,
            maxHeight: "90vh",
            borderRadius: "12px",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            component='h2'
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Order Details
          </Typography>
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <Select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              sx={{
                fontSize: 13,
                borderRadius: "8px",
                bgcolor: "background.paper",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "text.disabled",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {orderStatusEnum.enumValues.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
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
                  <PersonOutlineIcon sx={{ fontSize: 16, color: ORANGE }} />
                  <Box component='span' sx={{ fontWeight: 600 }}>
                    {order.customerName}
                  </Box>
                </Box>
                <Box sx={infoRowSx}>
                  <PhoneOutlinedIcon sx={{ fontSize: 16, color: ORANGE }} />
                  <Box component='span'>{order.phoneNumber}</Box>
                </Box>
                <Box sx={{ ...infoRowSx, alignItems: "flex-start" }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 16, color: ORANGE, mt: "2px" }} />
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
                  <ScheduleIcon sx={{ fontSize: 16, color: ORANGE }} />
                  <Box component='span'>{format(new Date(order.createdAt), "PPP p")}</Box>
                </Box>
                <Box sx={{ ...infoRowSx, flexWrap: "wrap" }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: ORANGE }} />
                  <Box component='span' sx={{ fontWeight: 700, color: ORANGE_DARK }}>
                    ৳{Number(order.totalAmount).toLocaleString()}
                  </Box>
                  <Chip
                    label={order.paymentMethod.replace(/_/g, " ")}
                    size='small'
                    variant='outlined'
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: 10,
                      fontWeight: 600,
                      borderColor: "divider",
                      color: "text.secondary",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
                <Box sx={infoRowSx}>
                  <MonitorOutlinedIcon sx={{ fontSize: 20, color: ORANGE }} />
                  <Box
                    component='span'
                    title={order.userAgent}
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

          <Divider sx={{ borderColor: "grey.100" }} />

          {/* Products table */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
                fontStyle: "italic",
              }}
            >
              <LocalMallOutlinedIcon sx={{ fontSize: 16, color: ORANGE }} />
              <Typography component='h3' sx={{ ...sectionTitleSx, mb: 0 }}>
                Order items
              </Typography>
            </Box>

            <Box
              sx={{
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "grey.100",
                overflow: "hidden",
              }}
            >
              <Box
                component='table'
                sx={{
                  width: "100%",
                  fontSize: 14,
                  textAlign: "left",
                  borderCollapse: "collapse",
                }}
              >
                <Box
                  component='thead'
                  sx={{
                    bgcolor: "grey.50",
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
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
                          px: 2,
                          py: 1,
                          fontWeight: 700,
                          textAlign: h.align,
                          fontSize: 13,
                          color: "text.primary",
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
                        bgcolor: "#fff",
                        borderBottom: idx < items.length - 1 ? "1px solid" : "none",
                        borderColor: "grey.100",
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: "rgba(249,250,251,0.5)" },
                      }}
                    >
                      <Box component='td' sx={{ px: 2, py: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {item.image && (
                            <Box
                              component='img'
                              src={getAssetUrl(item.image)}
                              alt={item.title}
                              sx={{
                                height: 32,
                                width: 32,
                                objectFit: "contain",
                                borderRadius: "4px",
                                border: "1px solid",
                                borderColor: "grey.100",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                            {item.title}
                          </Box>
                        </Box>
                      </Box>
                      <Box component='td' sx={{ px: 2, py: 1.5, color: "text.primary" }}>
                        ৳{Number(item.price).toLocaleString()}
                      </Box>
                      <Box component='td' sx={{ px: 2, py: 1.5, color: "text.primary" }}>
                        ×{item.qty}
                      </Box>
                      <Box
                        component='td'
                        sx={{
                          px: 2,
                          py: 1.5,
                          textAlign: "right",
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        ৳{(Number(item.price) * item.qty).toLocaleString()}
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box component='tfoot' sx={{ bgcolor: "rgba(249,250,251,0.5)", fontWeight: 700 }}>
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
                        color: ORANGE_DARK,
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
                    borderRadius: "8px",
                    bgcolor: "#fff7ed",
                    p: 1.5,
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "#7c2d12",
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
                    borderRadius: "8px",
                    bgcolor: "#f0fdf4",
                    p: 1.5,
                    fontSize: 10,
                    lineHeight: 1.65,
                    color: "#14532d",
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
      </DialogContent>
    </Dialog>
  );
}
