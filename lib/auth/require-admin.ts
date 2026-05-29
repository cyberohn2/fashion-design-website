import { redirect } from "next/navigation";
import { requireAuth } from "./require-auth";

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}
