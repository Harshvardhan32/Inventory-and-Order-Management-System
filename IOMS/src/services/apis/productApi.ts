import toast from "react-hot-toast";
import apiConnector from "../apiConnector";
import type { Product } from "../../interfaces/interface";

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

export const getAllProduct = async (
    page = 1,
    all = false
): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
} | null> => {
    try {
        const token = getAccessToken();

        const url = all
            ? `${API_BASE_URL}/products/?all=true`
            : `${API_BASE_URL}/products/?page=${page}`;

        const response = await apiConnector("GET", url, undefined, {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });

        if (response.status !== 200) {
            throw new Error("Product fetching failed!");
        }

        return response.data as {
            count: number;
            next: string | null;
            previous: string | null;
            results: Product[];
        };
    } catch (error: any) {
        console.error("Get all products error:", error);
        toast.error("Failed to fetch products!");
        return null;
    }
};

export const getTopSellingProducts = async () => {
    let result: Product[] = [];
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "GET",
            `${API_BASE_URL}/products/?top=true`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Product fetching failed!");
        }

        result = response.data as Product[];
    } catch (error) {
        console.error("Get all products error:", error);
        toast.error("Failed to fetch products!");
    } finally {
        return result;
    }
};

export const createProduct = async (formData: Product): Promise<boolean> => {
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/products/`,
            formData,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (![200, 201].includes(response.status)) {
            throw new Error("Product creation failed!");
        }

        return true;
    } catch (error: any) {
        console.error("Create product error:", error);
        toast.error("Product creation failed!");
        return false;
    }
};

export const getProductById = async (id: string): Promise<Product | null> => {
    let result: Product | null = null;
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "GET",
            `${API_BASE_URL}/products/${id}/`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Failed to fetch product!");
        }

        result = response.data as Product;
    } catch (error: any) {
        console.error("Get product by ID error:", error);
        toast.error("Product not found!");
    }
    return result;
};

export const updateProduct = async (
    id: string,
    data: Product
): Promise<Product | null> => {
    let result: Product | null = null;
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "PUT",
            `${API_BASE_URL}/products/${id}/`,
            data,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Product update failed!");
        }

        result = response.data as Product;
    } catch (error: any) {
        console.error("Update product error:", error);
        toast.error("Product update failed!");
    }
    return result;
};

export const deleteProductById = async (id: string) => {
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "DELETE",
            `${API_BASE_URL}/products/${id}/`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 204 && response.status !== 200) {
            throw new Error("Product deletion failed!");
        }
    } catch (error: any) {
        console.error("Delete product error:", error);
        toast.error("Product deletion failed!");
    }
};
