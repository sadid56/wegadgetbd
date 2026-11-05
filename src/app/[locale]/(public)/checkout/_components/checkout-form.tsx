"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@/components/ui/input";
import { tokens } from "@/theme/theme";
import { BN } from "./checkout-constants";
import { Field } from "./checkout-field";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/i18n-utils";

interface CheckoutFormProps {
  register: any;
  errors: any;
  locationValue: string;
  setValue: any;
}

export function CheckoutForm({ register, errors, locationValue, setValue }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();

  const locationOptions = [
    { value: "inside_dhaka", label: t("insideDhaka"), charge: formatPrice(80, locale), desc: t("insideDhakaDesc") },
    { value: "outside_dhaka", label: t("outsideDhaka"), charge: formatPrice(130, locale), desc: t("outsideDhakaDesc") },
  ] as const;

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
          fontSize: { xs: 17, sm: 19 },
          fontWeight: 700,
          color: tokens.textPrimary,
          mb: { xs: 2.5, md: 3 },
          pb: 1.5,
          borderBottom: `1px solid ${tokens.borderDefault}`,
        }}
      >
        {t("formTitle")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Field label={t("nameLabel")} error={errors.name?.message}>
          <TextField
            {...fieldProps("name")}
            placeholder={t("namePlaceholder")}
            fullWidth
          />
        </Field>

        <Field label={t("phoneLabel")} hint={t("phoneHint")} error={errors.phone?.message}>
          <TextField
            {...fieldProps("phone")}
            placeholder={t("phonePlaceholder")}
            fullWidth
            slotProps={{
              htmlInput: {
                style: { fontSize: 13, letterSpacing: "0.08em" },
              },
            }}
          />
        </Field>

        <Field label={t("addressLabel")} error={errors.address?.message}>
          <TextField
            {...fieldProps("address")}
            placeholder={t("addressPlaceholder")}
            fullWidth
            multiline
            minRows={2}
          />
        </Field>

        <Field label={t("deliveryAreaLabel")} error={errors.location?.message}>
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
