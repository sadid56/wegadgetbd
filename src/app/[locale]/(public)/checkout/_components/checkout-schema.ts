import * as z from "zod";

export const getCheckoutSchema = (t?: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t ? t("nameRequired") : "Name is required"),
    phone: z
      .string()
      .regex(/^[0-9]+$/, t ? t("phoneInvalid") : "Valid 11-digit mobile number required")
      .min(11, t ? t("phoneInvalid") : "Valid 11-digit mobile number required")
      .max(11, t ? t("phoneInvalid") : "Valid 11-digit mobile number required"),
    address: z.string().min(10, t ? t("addressMin") : "Full delivery address required"),
    location: z.enum(["inside_dhaka", "outside_dhaka"], {
      message: t ? t("deliveryAreaRequired") : "Please select delivery area",
    }),
  });

export const checkoutSchema = getCheckoutSchema();

export type CheckoutValues = z.infer<typeof checkoutSchema>;
