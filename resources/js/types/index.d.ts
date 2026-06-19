import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface Auth {
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    roles_id: number;
    email_verified_at: string | null;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url?: string;
    icon?: LucideIcon | null;
    children?: any[];
    isActive?: boolean;
}
