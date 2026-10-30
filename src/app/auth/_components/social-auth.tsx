"use client";

import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import { getGoogleOAuthUrlAction } from "@/server/actions/auth.action";
import { tokens } from "@/theme/theme";

const GOOGLE_PATHS = [
  {
    fill: "#4285F4",
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
  },
  {
    fill: "#34A853",
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
  },
  {
    fill: "#FBBC05",
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z",
  },
  {
    fill: "#EA4335",
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z",
  },
];

function GoogleIcon() {
  return (
    <Box component='svg' viewBox='0 0 24 24' sx={{ width: 18, height: 18, display: "inline-block", flexShrink: 0 }}>
      {GOOGLE_PATHS.map(({ fill, d }) => (
        <path key={fill} fill={fill} d={d} />
      ))}
    </Box>
  );
}

const buttonSx = {
  py: 1.2,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: "10px",
  borderColor: tokens.borderDefault,
  color: tokens.textPrimary,
  "&:hover": { borderColor: tokens.primaryBorder, bgcolor: tokens.bgSubtle },
};

type OAuthResult = { success: boolean; data?: { url?: string }; error?: string };

interface ProviderConfig {
  id: string;
  name: string;
  icon: ReactNode;
  getUrl: (next: string) => Promise<OAuthResult>;
}

const PROVIDERS: ProviderConfig[] = [{ id: "google", name: "Google", icon: <GoogleIcon />, getUrl: getGoogleOAuthUrlAction }];

export type SocialMode = "signin" | "signup";

const MODE_TEXT: Record<SocialMode, { verb: string; noun: string }> = {
  signin: { verb: "Continue", noun: "sign in" },
  signup: { verb: "Sign up", noun: "sign-up" },
};

interface SocialAuthProps {
  mode: SocialMode;
  next: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  dividerLabel?: string | null;
}

export function SocialAuth({ mode, next, disabled = false, onLoadingChange, dividerLabel = "Or continue with email" }: SocialAuthProps) {
  const toast = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { verb, noun } = MODE_TEXT[mode];

  async function handleClick(provider: ProviderConfig) {
    setLoadingId(provider.id);
    onLoadingChange?.(true);
    try {
      const res = await provider.getUrl(next);
      if (!res.success || !res.data?.url) {
        toast.error(res.error || `${provider.name} ${noun} failed`);
        setLoadingId(null);
        onLoadingChange?.(false);
        return;
      }
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err?.message || `${provider.name} ${noun} failed`);
      setLoadingId(null);
      onLoadingChange?.(false);
    }
  }

  const isBusy = loadingId !== null;

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {PROVIDERS.map((provider) => {
          const isLoading = loadingId === provider.id;
          return (
            <Button
              key={provider.id}
              type='button'
              variant='secondary'
              fullWidth
              disabled={disabled || isBusy}
              loading={isLoading}
              onClick={() => handleClick(provider)}
              startIcon={isLoading ? undefined : provider.icon}
              sx={buttonSx}
            >
              {verb} with {provider.name}
            </Button>
          );
        })}
      </Box>

      {dividerLabel && (
        <Box sx={{ position: "relative", my: 2.8, textAlign: "center" }}>
          <Divider sx={{ borderColor: tokens.borderDefault }} />
          <Typography
            variant='caption'
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: tokens.bgPanel,
              px: 1.5,
              fontWeight: 600,
              color: tokens.textMuted,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {dividerLabel}
          </Typography>
        </Box>
      )}
    </>
  );
}
