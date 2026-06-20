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
        url: "/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Notes",
        url: "/notes",
        icon: BookCheck,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: User,
    },
    {
        title: "Product",
        url: "/products",
        icon: ShoppingBasket,
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: ShelvingUnit,
    },
    {
        title: "Sales",
        url: "/sales",
        icon: ShelvingUnit,
    },
    {
        title: "Finance",
        icon: Banknote,
        children: [
            {
                title: "Cash Flow",
                url: "/finance/cashflow",
                icon: Wallet,
            },
            {
                title: "Transaction",
                url: "/finance/transactions",
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
