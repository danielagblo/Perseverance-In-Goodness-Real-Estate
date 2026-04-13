"use server";

import { login as authLogin, logout as authLogout } from "./auth";

export async function login(password: string) {
  return await authLogin(password);
}

export async function logout() {
  return await authLogout();
}
