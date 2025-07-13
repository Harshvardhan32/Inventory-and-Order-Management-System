export interface MonthlyRevenue {
    label: string;
    value: number;
}

export interface Product {
    name: string;
    price: number;
    SKU: string;
    stock: number;
    status: string;
    units_sold?: number;
    id?: number;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}

export interface CustomerOrder {
    id: number;
    order_id: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
    total_items: number;
    total_price: number;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
    orders: CustomerOrder[];
}

interface Item {
    id: number;
    name: string;
    price: string;
    sku: string;
    stock: number;
    quantity: number;
    price_at_order_time: any;
    active?: boolean;
}

export interface ProductListItem {
    id: string;
    name: string;
    stock: number;
}

export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled";

export interface ProductListItem {
    id: string;
    name: string;
    stock: number;
    price: number;
}

export interface OrderItem {
    product?: { price: string };
    product_id: number;
    quantity: number;
    price_at_order_time: number;
}

export interface Order {
    id?: string;
    customer: number | Customer;
    status: OrderStatus;
    items: OrderItem[];
    date: string;
}

export interface OrderResponse {
    id?: string;
    customer: Customer;
    status: OrderStatus;
    items: Item[];
    date: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at: string;
    orders: CustomerOrder[];
}

export interface CustomerCreateInput {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface RevenueCard {
    id: number;
    heading: string;
    number: string | number;
}
