import type { Order, OrderResponse } from "../../interfaces/interface";
import apiConnector from "../apiConnector";
import toast from "react-hot-toast";
import { refreshAccessToken } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAccessToken = (): string => {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");

    if (!auth?.access || !auth.expires_at) {
        throw new Error("Invalid or missing auth data");
    }

    if (Date.now() >= auth.expires_at) {
        throw new Error("Access token has expired");
    }

    return auth.access;
};

export const getOrderById = async (
    id: string
): Promise<OrderResponse | null> => {
    let result: OrderResponse | null = null;
    try {
        const token = getAccessToken();
        if (!token) throw new Error("No access token found");

        const response = await apiConnector(
            "GET",
            `${API_BASE_URL}/orders/${id}/`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Something went wrong!");
        }

        result = response.data as OrderResponse;
    } catch (error: any) {
        console.error("Get order by ID error:", error);
        toast.error("Order not found!");
    }
    return result;
};

export const createOrder = async (
    order: Order,
    navigate: (path: string) => void
) => {
    try {
        const token = getAccessToken();
        if (!token) throw new Error("No access token found");

        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/orders/`,
            order,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (![200, 201].includes(response.status)) {
            throw new Error("Something went wrong!");
        }
        navigate("/orders");
    } catch (error: any) {
        console.error("Create order error:", error);
        toast.error("Order creation failed!");
    }
};

export const updateOrder = async (
    id: string,
    order: Order,
    navigate: (path: string) => void
): Promise<Order | null> => {
    let result: Order | null = null;
    try {
        const token = getAccessToken();
        if (!token) throw new Error("No access token found");

        const response = await apiConnector(
            "PUT",
            `${API_BASE_URL}/orders/${id}/`,
            order,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Something went wrong!");
        }

        result = response.data as Order;
        navigate("/orders");
    } catch (error: any) {
        console.error("Update order error:", error);
        toast.error("Order update failed!");
    }
    return result;
};

type PaginatedOrderResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: OrderResponse[];
};

export const getAllOrder = async (
    page = 1,
    all = false
): Promise<PaginatedOrderResponse | null> => {
    try {
        const token = getAccessToken();
        if (!token) throw new Error("No access token found");

        const url = all
            ? `${API_BASE_URL}/orders/?all=true`
            : `${API_BASE_URL}/orders/?page=${page}`;

        const response = await apiConnector("GET", url, undefined, {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });

        if (response.status !== 200) {
            throw new Error("Order fetching failed!");
        }

        return response.data as PaginatedOrderResponse;
    } catch (error: any) {
        console.error("Get all orders error:", error);
        toast.error("Failed to fetch orders!");
        return null;
    }
};

export const getRecentOrders = async (
    all = false
): Promise<OrderResponse | null> => {
    try {
        const authString = localStorage.getItem("auth");
        const accessToken = authString ? JSON.parse(authString).access : null;
        if (!accessToken) throw new Error("No access token found");

        const response = await apiConnector(
            "GET",
            `${API_BASE_URL}/orders/?all=${all}`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Order fetching failed!");
        }

        return response.data as OrderResponse;
    } catch (error: any) {
        console.log("Error message:", error.message);

        if (error.response?.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                return getRecentOrders(all);
            } else {
                console.log("Session expired. Please login again.");
            }
        }

        return null;
    }
};
