"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { keyframes } from "@emotion/react";
import { BN } from "./checkout-constants";
import { Field } from "./checkout-field";

interface CheckoutFormProps {
  register: any;
  errors: any;
  locationValue: string;
  setValue: any;
}

const fadeInX = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: { xs: 40, md: 48 },
    borderRadius: "8px",
    bgcolor: "#fff",
    fontSize: 14,
    transition: "all 200ms",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#e5e7eb" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(249,115,22,0.2)" },
    "&.Mui-error fieldset": { borderColor: "#dc2626" },
  },
  "& .MuiOutlinedInput-input": {
    padding: "0 12px",
    height: "100%",
    boxSizing: "border-box",
  },
} as const;

const textareaSx = {
  "& .MuiOutlinedInput-root": {
    height: "auto",
    borderRadius: "12px",
    bgcolor: "#fff",
    fontSize: 14,
    padding: "8px 12px",
    transition: "all 200ms",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#e5e7eb" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(249,115,22,0.2)" },
    "&.Mui-error fieldset": { borderColor: "#dc2626" },
  },
  "& .MuiOutlinedInput-input": {
    padding: 0,
    "&::placeholder": { color: "#9ca3af", opacity: 1 },
  },
} as const;

const locationOptions = [
  { value: "inside_dhaka", label: "ঢাকার ভিতরে", charge: "৳80", desc: "হোম ডেলিভারি" },
  { value: "outside_dhaka", label: "ঢাকার বাইরে", charge: "৳130", desc: "কুরিয়ার ডেলিভারি" },
] as const;

export function CheckoutForm({ register, errors, locationValue, setValue }: CheckoutFormProps) {
  const fieldProps = (name: string) => {
    const { ref, ...rest } = register(name);
    return { ...rest, inputRef: ref };
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        borderRadius: "24px 24px 0 0",
        px: 3,
        py: 2.5,
        mb: { xs: 0, md: 2.5 },
        border: "1px solid",
        borderColor: "grey.100",
        animation: `${fadeInX} 400ms ease-out both`,
      }}
    >
      <Typography
        component='h2'
        sx={{
          ...BN,
          fontSize: 20,
          fontWeight: 700,
          color: "grey.800",
          mb: { xs: 2, md: 4 },
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.5, md: 3 },
        }}
      >
        <Field label='আপনার নাম*' error={errors.name?.message}>
          <TextField
            {...fieldProps("name")}
            placeholder='আপনার নাম'
            fullWidth
            sx={{ ...fieldSx, ...BN, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"] } }}
            inputProps={{ style: BN }}
          />
        </Field>

        <Field label='আপনার নম্বর*' hint='সঠিক নম্বর ডিজিট দিন' error={errors.phone?.message}>
          <TextField
            {...fieldProps("phone")}
            placeholder='017******09'
            fullWidth
            sx={fieldSx}
            inputProps={{
              style: { ...BN, fontSize: 12, letterSpacing: "0.15em" },
            }}
          />
        </Field>

        <Field label='সম্পূর্ণ ঠিকানা*' error={errors.address?.message}>
          <TextField
            {...fieldProps("address")}
            placeholder='জেলা, থানা, সম্পূর্ণ ঠিকানা'
            fullWidth
            multiline
            minRows={2}
            sx={{
              ...textareaSx,
              "& .MuiOutlinedInput-input": {
                ...textareaSx["& .MuiOutlinedInput-input"],
                minHeight: "50px !important",
                fontFamily: BN.fontFamily,
              },
            }}
          />
        </Field>

        <Field label='ডেলিভারি এরিয়া সিলেক্ট করুন*' error={errors.location?.message}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 1.5,
              mt: 1,
            }}
          >
            {locationOptions.map((opt) => {
              const active = locationValue === opt.value;
              return (
                <Box
                  key={opt.value}
                  component='button'
                  type='button'
                  onClick={() => setValue("location", opt.value as "inside_dhaka" | "outside_dhaka")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                    px: 1.5,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: active ? "#f97316" : "grey.200",
                    bgcolor: active ? "#fff7ed" : "#fff",
                    boxShadow: active ? "0 0 0 2px #fed7aa" : "none",
                    cursor: "pointer",
                    transition: "all 300ms",
                    textAlign: "left",
                    "&:hover": {
                      borderColor: active ? "#f97316" : "#fdba74",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {active && (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: "#f97316",
                          borderRadius: "50%",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography
                      component='span'
                      sx={{
                        ...BN,
                        fontSize: 14,
                        fontWeight: 700,
                        color: active ? "#ea580c" : "grey.700",
                      }}
                    >
                      {opt.label}
                    </Typography>
                    <Typography component='span' sx={{ ...BN, fontSize: 12, color: "grey.500" }}>
                      ({opt.desc})
                    </Typography>
                  </Box>

                  <Typography
                    component='span'
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#f97316",
                      flexShrink: 0,
                    }}
                  >
                    {opt.charge}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Field>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {/* ⚠️ Original bug preserved: this registers "address" again,
              overwriting the address above on submit. Consider registering
              a distinct field name (e.g. "note") if your schema has one. */}
          <Field label='অর্ডার নোট*' error={errors.address?.message}>
            <TextField
              {...fieldProps("address")}
              placeholder='আপনার মতামত জানান....'
              fullWidth
              multiline
              minRows={2}
              sx={{
                ...textareaSx,
                "& .MuiOutlinedInput-input": {
                  ...textareaSx["& .MuiOutlinedInput-input"],
                  minHeight: "53px !important",
                  fontFamily: BN.fontFamily,
                },
              }}
            />
          </Field>
        </Box>
      </Box>
    </Box>
  );
}
