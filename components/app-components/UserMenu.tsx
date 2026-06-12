import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation"
import { useState } from "react";

const UserMenu = () => {
  const { userState, userDispatch } = useAuthContext();
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    const result = await response.json();
    if (result.success) {
      userDispatch({ type: "LOGOUT" });
      router.push("/login");
    }
    setLoggingOut(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>
            {userState?.user?.full_name?.slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-4">
        <DropdownMenuLabel className="font-bold">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-4 space-y-2" />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"/order-history"}>Order History</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="">
            <Link href={"/measurements/manage"}>Measurements</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="">
            <Link href={"/addresses/manage"}>Addresses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-black text-white">
            <Link href={"/create-order"}>New Order</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogout()} disabled={loggingOut}>
            {loggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu
