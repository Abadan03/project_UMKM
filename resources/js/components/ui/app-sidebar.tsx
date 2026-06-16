import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
    BookCheck,
    Banknote,
    ShelvingUnit,
    ShoppingBasket,
    BookCopy,
    BookOpenText,
    LayoutGrid,
    LibraryBig,
    User,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: User,
    },
    {
        title: "Product",
        url: "/admin/toefl",
        icon: ShoppingBasket,
    },
    {
        title: "Inventory",
        url: "/admin/questions",
        icon: ShelvingUnit,
    },
    {
        title: "Sales",
        url: "/admin/questions",
        icon: ShelvingUnit,
    },
    {
        title: "Finance",
        url: "/admin/attempts",
        icon: Banknote,
    },
    {
        title: "Cashflow",
        url: "/admin/attempts",
        icon: Banknote,
    },
    {
        title: "Transaction",
        url: "/admin/attempts",
        icon: Banknote,
    },
    {
        title: "Notes",
        url: "/admin/attempts",
        icon: BookCheck,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
