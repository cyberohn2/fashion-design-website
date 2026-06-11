"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./admin-nav-main";
import { NavUser } from "./admin-nav-user";
import { CreditCard, LayoutDashboard, ListTodo, MessageCircle, Store, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "#",
      icon: ListTodo,
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "Products",
      url: "#",
      icon: Store,
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
    },
    {
      title: "Reviews",
      url: "#",
      icon: MessageCircle,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="#">
                <Image
                    className="w-auto h-auto"
                    src="/logo.webp"
                    alt="george-wears-logo"
                    width={50}
                    height={50}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
