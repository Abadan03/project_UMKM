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
    LayoutGrid,
    User,
    ShoppingBasket,
    ShelvingUnit,
    Banknote,
    Receipt,
    Wallet,
    BookCheck,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Notes",
        url: "/admin/notes",
        icon: BookCheck,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: User,
    },
    {
        title: "Product",
        url: "/admin/products",
        icon: ShoppingBasket,
    },
    {
        title: "Inventory",
        url: "/admin/inventory",
        icon: ShelvingUnit,
    },
    {
        title: "Sales",
        url: "/admin/sales",
        icon: ShelvingUnit,
    },
    {
        title: "Finance",
        icon: Banknote,
        children: [
            {
                title: "Cash Flow",
                url: "/admin/finance/cashflow",
                icon: Wallet,
            },
            {
                title: "Transaction",
                url: "/admin/finance/transactions",
                icon: Receipt,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#" prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
