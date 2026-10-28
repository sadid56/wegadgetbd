"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import { signIn } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: 14,
    bgcolor: "background.paper",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "text.disabled" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
} as const;

export default function SignInPage() {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { ref: emailRef, ...emailProps } = form.register("email");
  const { ref: passwordRef, ...passwordProps } = form.register("password");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed in successfully");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong");
          setIsLoading(false);
        },
      },
    });
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <CardHeader
        title={
          <Typography component='h1' sx={{ fontSize: 20, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
            Sign In
          </Typography>
        }
        subheader={
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Enter your email below to login to your account</Typography>
        }
        sx={{ pb: 1.5 }}
      />

      <CardContent>
        <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Email */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box component='label' htmlFor='email' sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", lineHeight: 1 }}>
              Email
            </Box>
            <TextField
              id='email'
              type='email'
              placeholder='m@example.com'
              fullWidth
              size='small'
              inputRef={emailRef}
              {...emailProps}
              sx={inputSx}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
            />
          </Box>

          {/* Password */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box component='label' htmlFor='password' sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", lineHeight: 1 }}>
              Password
            </Box>
            <TextField
              id='password'
              type='password'
              fullWidth
              size='small'
              inputRef={passwordRef}
              {...passwordProps}
              sx={inputSx}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
            />
          </Box>

          <Button
            type='submit'
            fullWidth
            disabled={isLoading}
            disableElevation
            startIcon={isLoading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
            sx={{
              height: 40,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 14,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Divider */}
        <Box sx={{ position: "relative", my: 2 }}>
          <Divider />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              px: 1,
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              color: "text.secondary",
              lineHeight: 1,
            }}
          >
            Or continue with
          </Box>
        </Box>

        {/* Google */}
        <Button
          type='button'
          fullWidth
          variant='outlined'
          disabled={isLoading}
          disableElevation
          onClick={handleGoogleSignIn}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} sx={{ color: "inherit" }} />
            ) : (
              <Box
                component='svg'
                aria-hidden='true'
                focusable='false'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 488 512'
                sx={{ width: 16, height: 16 }}
              >
                <path
                  fill='currentColor'
                  d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
                />
              </Box>
            )
          }
          sx={{
            height: 40,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            borderColor: "divider",
            color: "text.primary",
            "&:hover": {
              borderColor: "text.disabled",
              bgcolor: "action.hover",
            },
          }}
        >
          Google
        </Button>
      </CardContent>

      <Box
        sx={{
          px: 2,
          pb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        <Box component='span'>Don&apos;t have an account?</Box>
        <Box
          component={NextLink}
          href='/auth/sign-up'
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign up
        </Box>
      </Box>
    </Card>
  );
}
