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

export interface ModuleProps {
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

export interface PaginationProps<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
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

export interface Product {
    id: number;
    name: string;
    qty: number;
    unit: string;
    cost_price: number;
    sell_price: number;
    description: string;
    created_at?: string;
    updated_at: string;
}

export interface ProductProps {
    id: number;
    name: string;
    qty: number;
    unit_id: number;
    unit: UnitsProps | null;
    unit_name?: string;
    unit_code?: string;
    cost_price: number;
    sell_price: number;
    inventory?: InventoryProps | null;
    description: string;
    created_at: string;
    updated_at: string;
}

// 2. Update interface Inventory kamu
export interface InventoryProps {
    id: number;
    isActive: "YES" | "NO"; // Tanda '?' bisa dihapus kalau datanya selalu ada (wajib) dari DB
    products_id: number;
    qty: number;

    minimum_stock: number;
    last_stock_in: number;
    last_stock_out: number;

    // Hasil dari relasi Laravel ->with('product') akan masuk ke sini
    product?: ProductProps | null;

    // Bawaan dari Laravel timestamps
    created_at?: string;
    updated_at?: string;
}

export interface Sales {
    id: number;
    invoice_number: string;
    transaction_type: string;
    cashier_id: number;
    customer_name?: string;
    subtotal: number;
    discount?: number;
    tax?: number;
    transaction_date: string;
    payment_method: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SalesProps {
    id: number;
    invoice_number: string;
    cashier_id?: number;
    cashier_name?: string;
    subtotal: number;
    discount?: number;
    tax?: number;
    transaction_date: string;
    updated_at: string;
    items?: SaleItemProps[];
    notes?: string;
    product?: Product[];
    transactions?: TransactionProps[];
}

export interface SaleItemProps {
    id: number;
    sale_id: number;
    product_id: number;
    product?: ProductProps | null; // Relasi ke Product
    quantity: number;
    unit_price: number;
    discount?: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
}

export interface TransactionProps {
    id: number;
    sale_id: number;
    transaction_type: string; // e.g., "payment", "refund"
    amount: number;
    payment_method: string; // e.g., "cash", "credit_card"
    reference_number?: string; // Optional, for payment gateway reference
    processed_at?: string; // Optional, timestamp of processing
    status: string; // e.g., "pending", "completed", "failed", "canceled"
    notes?: string; // Optional, any additional notes
    created_at: string;
    updated_at: string;
}

export interface Logs {
    id: string;
    module: ModuleProps;
    references_id: any;
    user_id: any;
    user: User;
    product: ProductProps;
    old_value: number;
    new_value: number;
    description: string;
    created_at: string;
    old_hpp: number;
}

// STAFF MANAGEMENT
export interface T_Staff {
    id: number;
    name: string;
    pin: string;
    users_id: number;
    roles_id: number;
    user?: User | null; // Relasi ke User
    roles?: Roles | null; // Relasi ke Roles
    created_at?: string;
    updated_at?: string;
}

export interface StaffFormData {
    id: number;
    name: string;
    pin: string;
    old_pin?: string;
    users_id: number;
    roles_id: number;
    // user?: User | null; // Relasi ke User
    // roles?: Roles | null;
    // role
}
