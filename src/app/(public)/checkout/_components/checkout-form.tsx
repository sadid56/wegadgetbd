"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@/components/ui/input";
import { tokens } from "@/theme/theme";
import { BN } from "./checkout-constants";
import { Field } from "./checkout-field";

interface CheckoutFormProps {
  register: any;
  errors: any;
  locationValue: string;
  setValue: any;
}

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
        bgcolor: tokens.bgPanel,
        borderRadius: "12px",
        p: { xs: 2.5, sm: 3 },
        border: `1px solid ${tokens.borderDefault}`,
      }}
    >
      <Typography
        component='h2'
        sx={{
          ...BN,
          fontSize: { xs: 17, sm: 19 },
          fontWeight: 700,
          color: tokens.textPrimary,
          mb: { xs: 2.5, md: 3 },
          pb: 1.5,
          borderBottom: `1px solid ${tokens.borderDefault}`,
        }}
      >
        ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Field label='আপনার নাম*' error={errors.name?.message}>
          <TextField
            {...fieldProps("name")}
            placeholder='আপনার নাম'
            fullWidth
            slotProps={{ htmlInput: { style: BN } }}
          />
        </Field>

        <Field label='আপনার নম্বর*' hint='সঠিক নম্বর ডিজিট দিন' error={errors.phone?.message}>
          <TextField
            {...fieldProps("phone")}
            placeholder='017******09'
            fullWidth
            slotProps={{
              htmlInput: {
                style: { ...BN, fontSize: 13, letterSpacing: "0.08em" },
              },
            }}
          />
        </Field>

        <Field label='সম্পূর্ণ ঠিকানা*' error={errors.address?.message}>
          <TextField
            {...fieldProps("address")}
            placeholder='বাসা/ফ্ল্যাট নম্বর, রাস্তা, এলাকা, থানা, জেলা'
            fullWidth
            multiline
            minRows={2}
          />
        </Field>

        <Field label='ডেলিভারি এরিয়া সিলেক্ট করুন*' error={errors.location?.message}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
              mt: 0.5,
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
                    p: 1.5,
                    borderRadius: "8px",
                    border: `1.5px solid ${active ? tokens.primary : tokens.borderDefault}`,
                    bgcolor: active ? tokens.primaryLight : tokens.bgCanvas,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 150ms ease, background-color 150ms ease",
                    "&:hover": {
                      borderColor: active ? tokens.primary : tokens.borderHover,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `2px solid ${active ? tokens.primary : tokens.borderElevated}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: tokens.bgPanel,
                        flexShrink: 0,
                      }}
                    >
                      {active && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: tokens.primary,
                          }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        component='span'
                        sx={{
                          ...BN,
                          fontSize: 13,
                          fontWeight: 700,
                          color: active ? tokens.textPrimary : tokens.textSecondary,
                          display: "block",
                        }}
                      >
                        {opt.label}
                      </Typography>
                      <Typography
                        component='span'
                        sx={{
                          ...BN,
                          fontSize: 11,
                          color: tokens.textMuted,
                          display: "block",
                        }}
                      >
                        {opt.desc}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    component='span'
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: active ? tokens.primary : tokens.textSecondary,
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
      </Box>
    </Box>
  );
}
