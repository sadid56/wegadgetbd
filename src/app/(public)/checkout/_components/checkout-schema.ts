import * as z from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "আপনার নাম লিখুন"),

  phone: z
    .string()
    .regex(/^[0-9]+$/, "শুধু সংখ্যা ব্যবহার করুন")
    .min(11, "সঠিক মোবাইল নম্বর দিন")
    .max(11, "মোবাইল নম্বর ১১ সংখ্যার হতে হবে"),

  address: z.string().min(10, "পুরো ঠিকানাটি লিখুন"),

  location: z.enum(["inside_dhaka", "outside_dhaka"], {
    message: "ডেলিভারি এরিয়া সিলেক্ট করুন",
  }),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
