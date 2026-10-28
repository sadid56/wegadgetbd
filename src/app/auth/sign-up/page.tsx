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

import { signUp } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

const labelSx = {
  fontSize: 14,
  fontWeight: 500,
  color: "text.primary",
  lineHeight: 1,
} as const;

const helperTextSx = { color: "error.main", fontSize: 12, mx: 0 } as const;

export default function SignUpPage() {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { ref: nameRef, ...nameProps } = form.register("name");
  const { ref: emailRef, ...emailProps } = form.register("email");
  const { ref: passwordRef, ...passwordProps } = form.register("password");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Account created successfully");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong");
          setIsLoading(false);
        },
      },
    });
  }

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
            Sign Up
          </Typography>
        }
        subheader={<Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Create an account to get started</Typography>}
        sx={{ pb: 1.5 }}
      />

      <CardContent>
        <Box component='form' onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Name */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box component='label' htmlFor='name' sx={labelSx}>
              Name
            </Box>
            <TextField
              id='name'
              placeholder='John Doe'
              fullWidth
              size='small'
              inputRef={nameRef}
              {...nameProps}
              sx={inputSx}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
            />
          </Box>

          {/* Email */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box component='label' htmlFor='email' sx={labelSx}>
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
            <Box component='label' htmlFor='password' sx={labelSx}>
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
            Create Account
          </Button>
        </Box>
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
        <Box component='span'>Already have an account?</Box>
        <Box
          component={NextLink}
          href='/auth/sign-in'
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign in
        </Box>
      </Box>
    </Card>
  );
}
