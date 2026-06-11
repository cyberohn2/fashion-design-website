import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RouteGuard } from "@/lib/auth/route-guard";
import { AdminHeader } from "@/components/app-components/admin-header";


export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <RouteGuard>
        <SidebarProvider>
            <SidebarInset>
            <main className="flex flex-1 flex-col">
            <AdminHeader />
                {children}
                <p className="text-red-500!">Something obvious</p>
            </main>
            </SidebarInset>
        </SidebarProvider>
    // </RouteGuard>
  );
}
