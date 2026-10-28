"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { keyframes } from "@emotion/react";

import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

interface OrderModalProps {
  product: any;
  qty: number;
  totalPrice: number;
  codName: string;
  setCodName: (value: string) => void;
  codPhone: string;
  setCodPhone: (value: string) => void;
  codAddress: string;
  setCodAddress: (value: string) => void;
  codShipping: number;
  setCodShipping: (value: number) => void;
  codNote: string;
  setCodNote: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const SHIPPING_OPTIONS = [
  { label: "Inside Dhaka", price: 70 },
  { label: "Inside Bogura", price: 80 },
  { label: "Outside Dhaka/Bogura", price: 130 },
] as const;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: "8px",
    bgcolor: "#fff",
    fontSize: 14,
    "& fieldset": { borderWidth: 2, borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#e5e7eb" },
    "&.Mui-focused fieldset": { borderColor: "#ff7319" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(255,115,25,0.2)" },
  },
} as const;

const iconStartSx = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#9ca3af",
  pointerEvents: "none",
  zIndex: 1,
} as const;

export default function OrderModal({
  qty,
  totalPrice,
  codName,
  setCodName,
  codPhone,
  setCodPhone,
  codAddress,
  setCodAddress,
  codShipping,
  setCodShipping,
  codNote,
  setCodNote,
  onClose,
  onConfirm,
}: OrderModalProps) {
  return (
    <Modal open onClose={onClose} closeAfterTransition>
      <Fade in timeout={200}>
        <Box
          onClick={(e) => e.target === e.currentTarget && onClose()}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.6)",
            p: 2,
            outline: "none",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              bgcolor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: 448,
              overflow: "hidden",
              animation: `${scaleIn} 220ms cubic-bezier(0.34, 1.3, 0.64, 1) both`,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(to right, #ff7319, #ff8c42)",
                px: 3,
                py: 3,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box component='h3' sx={{ fontSize: 24, fontWeight: 700, m: 0, lineHeight: 1.2 }}>
                  Complete Order
                </Box>
                <Box component='p' sx={{ fontSize: 14, color: "#ffedd5", mt: 0.5, mb: 0, lineHeight: 1.3 }}>
                  Cash on Delivery
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                aria-label='Close'
                sx={{
                  width: 40,
                  height: 40,
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.2)",
                  transition: "background-color 200ms",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Form */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {/* Name */}
              <Box>
                <Box
                  component='label'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  Full Name{" "}
                  <Box component='span' sx={{ color: "#ef4444" }}>
                    *
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <PersonOutlineIcon sx={{ ...iconStartSx, fontSize: 20 }} />
                  <TextField
                    type='text'
                    value={codName}
                    onChange={(e) => setCodName(e.target.value)}
                    placeholder='Enter your name'
                    fullWidth
                    sx={inputSx}
                    slotProps={{ htmlInput: { style: { paddingLeft: 44 } } }}
                  />
                </Box>
              </Box>

              {/* Phone */}
              <Box>
                <Box
                  component='label'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  Phone Number{" "}
                  <Box component='span' sx={{ color: "#ef4444" }}>
                    *
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <PhoneOutlinedIcon sx={{ ...iconStartSx, fontSize: 20 }} />
                  <TextField
                    type='tel'
                    value={codPhone}
                    onChange={(e) => setCodPhone(e.target.value)}
                    placeholder='01XXXXXXXXX'
                    fullWidth
                    sx={inputSx}
                    slotProps={{ htmlInput: { style: { paddingLeft: 44 } } }}
                  />
                </Box>
              </Box>

              {/* Address */}
              <Box>
                <Box
                  component='label'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  Delivery Address{" "}
                  <Box component='span' sx={{ color: "#ef4444" }}>
                    *
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <PlaceOutlinedIcon
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: 12,
                      color: "#9ca3af",
                      pointerEvents: "none",
                      zIndex: 1,
                      fontSize: 20,
                    }}
                  />
                  <TextField
                    value={codAddress}
                    onChange={(e) => setCodAddress(e.target.value)}
                    placeholder='Enter full address'
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{
                      ...inputSx,
                      "& .MuiOutlinedInput-root": {
                        ...inputSx["& .MuiOutlinedInput-root"],
                        height: "auto",
                        py: 1,
                      },
                      "& .MuiOutlinedInput-input": {
                        resize: "none",
                        paddingLeft: "44px !important",
                        paddingTop: "12px !important",
                        paddingBottom: "12px !important",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Shipping */}
              <Box>
                <Box
                  component='label'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1.5,
                  }}
                >
                  Shipping Method
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {SHIPPING_OPTIONS.map((option) => {
                    const active = codShipping === option.price;
                    return (
                      <Box
                        key={option.price}
                        component='label'
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          border: "2px solid",
                          borderColor: active ? "#ff7319" : "#e5e7eb",
                          bgcolor: active ? "#fff7ed" : "#fff",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 200ms",
                          "&:hover": { borderColor: active ? "#ff7319" : "#d1d5db" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              border: "2px solid",
                              borderColor: active ? "#ff7319" : "#d1d5db",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {active && (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: "#ff7319",
                                }}
                              />
                            )}
                          </Box>
                          <Box component='span' sx={{ fontWeight: 500, color: "#111827", fontSize: 14 }}>
                            {option.label}
                          </Box>
                        </Box>
                        <Box component='span' sx={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
                          ৳{option.price}
                        </Box>
                        <input
                          type='radio'
                          name='shipping'
                          value={option.price}
                          checked={active}
                          onChange={() => setCodShipping(option.price)}
                          style={{ display: "none" }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Note */}
              <Box>
                <Box
                  component='label'
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  Order Note (Optional)
                </Box>
                <TextField
                  type='text'
                  value={codNote}
                  onChange={(e) => setCodNote(e.target.value)}
                  placeholder='Any special requests?'
                  fullWidth
                  sx={inputSx}
                />
              </Box>

              {/* Summary */}
              <Box
                sx={{
                  bgcolor: "#f9fafb",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <Box component='span' sx={{ color: "#4b5563" }}>
                    Subtotal ({qty} items)
                  </Box>
                  <Box component='span' sx={{ fontWeight: 600, color: "#111827" }}>
                    ৳{totalPrice.toLocaleString()}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <Box component='span' sx={{ color: "#4b5563" }}>
                    Shipping
                  </Box>
                  <Box component='span' sx={{ fontWeight: 600, color: "#111827" }}>
                    ৳{codShipping}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box component='span' sx={{ fontWeight: 700, color: "#111827" }}>
                    Total
                  </Box>
                  <Box component='span' sx={{ fontWeight: 700, color: "#ff7319", fontSize: 18 }}>
                    ৳{(totalPrice + codShipping).toLocaleString()}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={onConfirm}
                fullWidth
                disableElevation
                startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />}
                sx={{
                  height: 56,
                  bgcolor: "#ff7319",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "12px",
                  fontSize: 15,
                  textTransform: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                  transition: "background-color 200ms",
                  "&:hover": { bgcolor: "#e66515" },
                }}
              >
                Confirm Order
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
