"use client"
import { useAuthContext } from "@/contexts/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

export const RouteGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const { userState } = useAuthContext()

  const isAdminRoute = pathname.startsWith("/admin")

  useEffect(() => {
    if (isAdminRoute && userState?.user?.role !== "ADMIN") {
      console.log("is not admin")
      router.push("/catalog");
    }
  }, []);

  return children
}