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

export interface Roles {
    id: number;
    name: string;
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

export interface UserFormData {
    id: number;
    name: string;
    email: string;
    role?: "admin" | "staff";
    roles_id: number;
    change_password?: boolean;
    old_password?: string;
    password?: string;
    password_confirmation?: string;
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

export interface PageProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
}

export interface UnitsProps {
    id: string;
    name: string;
    code: string;
}

// 1. Buat interface untuk Product-nya juga biar rapi
export interface ProductProps {
    id: number;
    name: string;
    qty: number;
    unit_id: number;
    unit: UnitsProps | null;
    pricing: number;
    description: string;
    created_at?: string;
    updated_at?: string;
}

// 2. Update interface Inventory kamu
export interface InventoryProps {
    id: number;
    isActive: "YES" | "NO"; // Tanda '?' bisa dihapus kalau datanya selalu ada (wajib) dari DB
    products_id: number;

    // Hasil dari relasi Laravel ->with('product') akan masuk ke sini
    product?: ProductProps | null;

    // Bawaan dari Laravel timestamps
    created_at?: string;
    updated_at?: string;
}
