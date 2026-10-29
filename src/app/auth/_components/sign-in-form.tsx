"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/context/toast-context";
import { signInAction } from "@/actions/auth";
import { supabase } from "@/lib/supabase";
import { tokens } from "@/theme/theme";
import { SocialAuth } from "./social-auth";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const cardSx = {
  p: { xs: 3, sm: 4 },
  borderRadius: "16px",
  bgcolor: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
  position: "relative",
};

const submitBtnSx = {
  mt: 1,
  py: 1.25,
  fontSize: 15,
  fontWeight: 600,
  borderRadius: "10px",
  boxShadow: "none",
  "&:hover": { bgcolor: tokens.primaryHover, boxShadow: "none" },
};

export function SignInForm() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const next = searchParams.get("next") || "/";
  const isAnyLoading = isLoading || isSocialLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const res = await signInAction(values);
      if (!res.success) {
        toast.error(res.error || "Failed to sign in");
        setIsLoading(false);
        return;
      }

      if (res.data?.session?.access_token) {
        await supabase.auth
          .setSession({
            access_token: res.data.session.access_token,
            refresh_token: res.data.session.refresh_token || "",
          })
          .catch(() => null);
      }

      toast.success("Signed in successfully");
      const defaultDest = res.data?.role === "ADMIN" ? "/admin" : "/";
      const target = next && next !== "/" ? next : defaultDest;
      router.push(target);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
      setIsLoading(false);
    }
  }

  return (
    <Card sx={cardSx}>
      <CardHeader sx={{ mb: 3, textAlign: "center" }}>
        <CardTitle sx={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: tokens.textPrimary }}>Welcome Back</CardTitle>
        <CardDescription sx={{ fontSize: 13.5, color: tokens.textSecondary, mt: 0.5 }}>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent sx={{ p: 0 }}>
        <SocialAuth mode='signin' next={next} disabled={isLoading} onLoadingChange={setIsSocialLoading} dividerLabel='Or' />

        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Input
            id='email'
            type='email'
            label='Email Address'
            placeholder='you@example.com'
            fullWidth
            disabled={isAnyLoading}
            startIcon={<MailOutlinedIcon sx={{ fontSize: 18, color: tokens.textMuted }} />}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />

          <Input
            id='password'
            type={showPassword ? "text" : "password"}
            label='Password'
            placeholder='••••••••'
            fullWidth
            disabled={isAnyLoading}
            startIcon={<LockOutlinedIcon sx={{ fontSize: 18, color: tokens.textMuted }} />}
            endIcon={
              <IconButton
                size='small'
                onClick={() => setShowPassword((prev) => !prev)}
                edge='end'
                disabled={isAnyLoading}
                sx={{ color: tokens.textMuted, "&:hover": { color: tokens.textPrimary } }}
              >
                {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 18 }} /> : <VisibilityOutlined sx={{ fontSize: 18 }} />}
              </IconButton>
            }
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
          />

          <Button type='submit' variant='primary' fullWidth loading={isLoading} disabled={isAnyLoading} size='large' sx={submitBtnSx}>
            Sign In
          </Button>
        </Box>

        <Box
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: `1px solid ${tokens.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.6,
            fontSize: 13.5,
            color: tokens.textSecondary,
          }}
        >
          <Box component='span'>Don&apos;t have an account?</Box>
          <Box
            component={NextLink}
            href='/auth/sign-up'
            sx={{
              color: tokens.primary,
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { color: tokens.primaryHover, textDecoration: "underline" },
            }}
          >
            Create account
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
