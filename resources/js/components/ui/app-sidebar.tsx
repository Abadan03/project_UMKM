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
    ShoppingCart,
    NotebookTabsIcon,
    IdCardLanyard,
} from "lucide-react";
import AppLogo from "./app-logo";

export const mainNavItems = [
    {
        label: "General",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutGrid,
            },
            {
                title: "Notes",
                url: "/notes",
                icon: NotebookTabsIcon,
            },
        ],
    },

    {
        label: "Users",
        items: [
            {
                title: "Users",
                icon: User,
                children: [
                    {
                        title: "User Management",
                        url: "/users",
                        icon: User,
                    },
                    {
                        title: "Staff Management",
                        url: "/staff",
                        icon: IdCardLanyard,
                    },
                ],
            },
        ],
    },

    {
        label: "Master",
        items: [
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
        ],
    },

    {
        label: "Sales",
        items: [
            {
                title: "Sales",
                url: "/sales",
                icon: Receipt,
            },

            {
                title: "Cashier",
                url: "/pos",
                icon: ShoppingCart,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            style={
                {
                    "--sidebar-background": "#2288cc",
                    "--sidebar-foreground": "#ffffff",
                    "--sidebar-border": "#1a0a2e",
                    "--sidebar-accent": "#ff8800",
                    "--sidebar-accent-foreground": "#1a0a2e",
                } as React.CSSProperties
            }
            className="
        font-mono
        uppercase
        border-r-4
        border-[#1a0a2e]
        shadow-[4px_0px_0px_0px_#1a0a2e]
        z-20

        [&_a]:rounded-none
        [&_button]:rounded-none
        [&_svg]:stroke-2

        /* collapsed */
        group-data-[collapsible=icon]:[&_[data-sidebar=menu-button]]:justify-center
        group-data-[collapsible=icon]:[&_[data-sidebar=menu-button]]:px-0
    "
        >
            {/* HEADER */}
            <SidebarHeader
                className="
            border-b-4
            border-[#1a0a2e]
            bg-[#44cc44]
            p-4

            group-data-[collapsible=icon]:p-2
        "
            >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="
                        bg-transparent
                        text-[#1a0a2e]

                        hover:bg-[#ff8800]
                        hover:text-[#1a0a2e]

                        border-2
                        border-transparent

                        hover:border-[#1a0a2e]
                        hover:shadow-[2px_2px_0px_0px_#1a0a2e]

                        transition-all

                        group-data-[collapsible=icon]:justify-center
                        group-data-[collapsible=icon]:px-0
                    "
                        >
                            <Link href="#" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent
                className="
                    p-3
                    gap-2

                    group-data-[collapsible=icon]:p-2

                    [&_a]:transition-all

                    [&_a:hover]:border-2
                    [&_a:hover]:border-[#1a0a2e]
                    [&_a:hover]:shadow-[2px_2px_0px_0px_#1a0a2e]
                    [&_a:hover]:-translate-y-[1px]
                    [&_a:hover]:-translate-x-[1px]
                "
            >
                <NavMain groups={mainNavItems} />
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter
                className="
            border-t-4
            border-[#1a0a2e]
            bg-[#44cc44]
            p-4
            text-[#1a0a2e]

            group-data-[collapsible=icon]:p-2
        "
            >
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
