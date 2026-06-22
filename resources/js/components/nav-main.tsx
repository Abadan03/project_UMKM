import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

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

    return (
        <SidebarContent>
            {groups.map((group) => (
                <SidebarGroup key={group.label} className="px-2 py-0">
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                    <SidebarMenu>
                        {group.items.map((item) => {
                            if (item.children?.length) {
                                return (
                                    <Collapsible
                                        key={item.title}
                                        defaultOpen={item.children.some(
                                            (child) => child.url === page.url,
                                        )}
                                        className="group"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    {item.icon && <item.icon />}

                                                    <span>{item.title}</span>

                                                    <ChevronRight className="ml-auto group-data-[state=open]:rotate-90 transition-transform" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <SidebarMenu className="ml-4 mt-1">
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
                                                                >
                                                                    <Link
                                                                        href={
                                                                            child.url!
                                                                        }
                                                                    >
                                                                        {child.icon && (
                                                                            <child.icon />
                                                                        )}
                                                                        <span>
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
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.url === page.url}
                                    >
                                        <Link href={item.url!}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </SidebarContent>
    );
}
