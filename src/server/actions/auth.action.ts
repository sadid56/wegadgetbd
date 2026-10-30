"use server";

import {
  SignInUseCase,
  SignUpUseCase,
  GetGoogleOAuthUrlUseCase,
  SignOutUseCase,
} from "@/server/use-case/auth/auth-use-cases";

export async function signInAction(input: FormData | { email: string; password: string }) {
  const useCase = new SignInUseCase();
  return useCase.execute(input);
}

export async function signUpAction(input: FormData | { name: string; email: string; password: string }) {
  const useCase = new SignUpUseCase();
  return useCase.execute(input);
}

export async function getGoogleOAuthUrlAction(redirectTo?: string) {
  const useCase = new GetGoogleOAuthUrlUseCase();
  return useCase.execute(redirectTo);
}

export async function signOutAction() {
  const useCase = new SignOutUseCase();
  return useCase.execute();
}
