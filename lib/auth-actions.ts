"use server";

import { redirect } from "next/navigation";
import { login as authLogin, logout as authLogout } from "./auth";

export async function login(password: string) {
  const success = await authLogin(password);
  if (success) {
    redirect("/admin");
  }
  return false;
}

export async function logout() {
  await authLogout();
  redirect("/admin/login");
}
