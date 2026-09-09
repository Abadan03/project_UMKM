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
                icon: BookCheck,
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
                        url: "/Staff",
                        icon: User,
                    },
                ],
            },
        ],
    },

    {
        label: "Master Data",
        items: [
            {
                title: "Product",
                url: "/products",
                icon: ShoppingBasket,
            },
        ],
    },

    {
        label: "Inventory",
        items: [
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
            // Meng-override CSS variables bawaan shadcn sidebar dengan warna dari paletmu
            style={
                {
                    "--sidebar-background": "#2288cc", // Background utama biru
                    "--sidebar-foreground": "#ffffff", // Teks warna putih
                    "--sidebar-border": "#1a0a2e", // Border gelap
                    "--sidebar-accent": "#ff8800", // Warna PINK saat menu di-hover
                    "--sidebar-accent-foreground": "#1a0a2e", // Teks jadi gelap saat di-hover
                } as React.CSSProperties
            }
            // Tambahkan font-mono, uppercase, border tebal, dan paksa semua elemen di dalamnya (a, button) jadi kotak (rounded-none)
            className="font-mono uppercase border-r-4 border-[#1a0a2e] shadow-[4px_0px_0px_0px_#1a0a2e] z-20 [&_a]:rounded-none [&_button]:rounded-none [&_svg]:stroke-2"
        >
            {/* Header Area - Aksen Kuning */}
            <SidebarHeader className="border-b-4 border-[#1a0a2e] bg-[#44cc44] p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            // Styling khusus tombol logo
                            className="bg-transparent text-[#1a0a2e] hover:bg-[#ff8800] hover:text-[#1a0a2e] border-2 border-transparent hover:border-[#1a0a2e] hover:shadow-[2px_2px_0px_0px_#1a0a2e] transition-all"
                        >
                            <Link href="#" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Content Area - Otomatis mengikuti background Biru dan aksen Pink berkat CSS Variables di atas */}
            <SidebarContent className="p-3 gap-2 [&_a:hover]:border-2 [&_a:hover]:border-[#1a0a2e] [&_a:hover]:shadow-[2px_2px_0px_0px_#1a0a2e] [&_a:hover]:-translate-y-[1px] [&_a:hover]:-translate-x-[1px] [&_a]:transition-all">
                <NavMain groups={mainNavItems} />
            </SidebarContent>

            {/* Footer Area - Aksen Hijau Terang */}
            <SidebarFooter className="border-t-4 border-[#1a0a2e] bg-[#44cc44] p-4 text-[#1a0a2e]">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
