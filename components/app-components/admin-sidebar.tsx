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
import { getCurrentUser } from "@/lib/auth/get-current-user";



export async function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = await getCurrentUser();

  const data = {
    user: {
      name: currentUser?.full_name,
      email: currentUser?.email,
      avatar: "/",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ListTodo,
      },
      {
        title: "Payments",
        url: "/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: Store,
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: Users,
      },
      {
        title: "Reviews",
        url: "/admin/reviews",
        icon: MessageCircle,
      },
    ],
  };

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
                <span>George Wears</span>
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
