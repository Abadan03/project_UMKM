import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

interface NavGroup {
    label: string;
    items: NavItem[];
}

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();
    const { state } = useSidebar();

    const isCollapsed = state === "collapsed";

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.label} className="px-2 py-0">
                    {/* Group label */}
                    <SidebarGroupLabel
                        className="
                            group-data-[collapsible=icon]:hidden
                        "
                    >
                        {group.label}
                    </SidebarGroupLabel>

                    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                        {group.items.map((item) => {
                            /*
                             * ========================================
                             * ITEM WITH CHILDREN
                             * ========================================
                             */
                            if (item.children?.length) {
                                const isChildActive = item.children.some(
                                    (child) => child.url === page.url,
                                );

                                return (
                                    <Collapsible
                                        key={item.title}
                                        defaultOpen={isChildActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <TooltipProvider>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={isChildActive}
                                                        className="
                                                        group-data-[collapsible=icon]:!justify-center
                                                        group-data-[collapsible=icon]:!px-0
                                                        group-data-[collapsible=icon]:!mx-auto
                                                    "
                                                    >
                                                        {item.icon && (
                                                            <item.icon />
                                                        )}

                                                        {/* Text */}
                                                        <span
                                                            className="
                                                            group-data-[collapsible=icon]:hidden
                                                        "
                                                        >
                                                            {item.title}
                                                        </span>

                                                        {/* Chevron */}
                                                        <ChevronRight
                                                            className="
                                                            ml-auto
                                                            size-4
                                                            transition-transform
                                                            group-data-[state=open]/collapsible:rotate-90
                                                            group-data-[collapsible=icon]:hidden
                                                        "
                                                        />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                            </TooltipProvider>

                                            {/*
                                             * Hide submenu completely when
                                             * sidebar is collapsed.
                                             */}
                                            {!isCollapsed && (
                                                <CollapsibleContent>
                                                    <SidebarMenu>
                                                        {item.children.map(
                                                            (child) => (
                                                                <SidebarMenuItem
                                                                    key={
                                                                        child.title
                                                                    }
                                                                >
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        isActive={
                                                                            child.url ===
                                                                            page.url
                                                                        }
                                                                        className="
                                                                            group-data-[collapsible=icon]:!justify-center
                                                                            group-data-[collapsible=icon]:!px-0
                                                                            group-data-[collapsible=icon]:!mx-auto
                                                                        "
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                child.url!
                                                                            }
                                                                        >
                                                                            {child.icon && (
                                                                                <child.icon />
                                                                            )}

                                                                            <span className="group-data-[collapsible=icon]:hidden">
                                                                                {
                                                                                    child.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            ),
                                                        )}
                                                    </SidebarMenu>
                                                </CollapsibleContent>
                                            )}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            /*
                             * ========================================
                             * NORMAL ITEM
                             * ========================================
                             */
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <TooltipProvider>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.url === page.url}
                                            tooltip={item.title}
                                            className="
                                            group-data-[collapsible=icon]:!justify-center
                                            group-data-[collapsible=icon]:!px-0
                                            group-data-[collapsible=icon]:!mx-auto
                                        "
                                        >
                                            <Link href={item.url!}>
                                                {item.icon && <item.icon />}

                                                <span
                                                    className="
                                                    group-data-[collapsible=icon]:hidden
                                                "
                                                >
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </TooltipProvider>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
