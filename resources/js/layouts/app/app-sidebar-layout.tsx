import { AppContent } from "@/components/ui/app-content";
import { AppShell } from "@/components/ui/app-shell";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppSidebarHeader } from "@/components/ui/app-sidebar-header";
import { type BreadcrumbItem } from "@/types";
import { type PropsWithChildren } from "react";

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    balance,
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    balance?: number | null;
}>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} balance={balance} />
                {children}
            </AppContent>
        </AppShell>
    );
}
