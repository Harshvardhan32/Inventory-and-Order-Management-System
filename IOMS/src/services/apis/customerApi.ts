import apiConnector from "../apiConnector";
import type { Customer, CustomerCreateInput } from "../../interfaces/interface";
import toast from "react-hot-toast";

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

export const createCustomer = async (
    data: CustomerCreateInput,
    navigate: (path: string) => void
) => {
    const toastId = toast.loading("Creating...");
    try {
        const token = getAccessToken();

        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/customers/`,
            data,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 201) {
            throw new Error("Failed to create customer");
        }

        toast.success("Customer created successfully!");
        navigate("/customers");
    } catch (error: any) {
        console.error("Create customer error:", error);
        toast.error("Customer creation failed!");
    } finally {
        toast.dismiss(toastId);
    }
};

export const updateCustomer = async (
    id: string,
    data: CustomerCreateInput,
    navigate: (path: string) => void
) => {
    const toastId = toast.loading("Updating...");
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "PUT",
            `${API_BASE_URL}/customers/${id}/`,
            data,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Failed to update customer");
        }

        toast.success("Customer updated successfully!");
        navigate("/customers");
    } catch (error: any) {
        console.error("Update customer error:", error);
        toast.error("Customer update failed!");
    } finally {
        toast.dismiss(toastId);
    }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
    let result: Customer | null = null;
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "GET",
            `${API_BASE_URL}/customers/${id}/`,
            undefined,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status !== 200) {
            throw new Error("Failed to fetch customer");
        }

        result = response.data as Customer;
    } catch (error: any) {
        console.error("Get customer by ID error:", error);
        toast.error("Customer not found!");
    }
    return result;
};

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const getAllCustomer = async (
    page = 1,
    all = false
): Promise<{ count: number; results: Customer[] }> => {
    try {
        const token = getAccessToken();
        if (!token) throw new Error("No access token found");

        const url = all
            ? `${API_BASE_URL}/customers/?all=true`
            : `${API_BASE_URL}/customers/?page=${page}`;

        const response = await apiConnector("GET", url, undefined, {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch customers");
        }

        if (Array.isArray(response.data)) {
            return {
                count: response.data.length,
                results: response.data as Customer[],
            };
        }

        const data = response.data as PaginatedResponse<Customer>;
        return {
            count: data.count,
            results: data.results,
        };
    } catch (error: any) {
        console.error("Get all customers error:", error);
        toast.error("Failed to fetch customers!");
        return { count: 0, results: [] };
    }
};

export const deleteCustomerById = async (id: string) => {
    try {
        const token = getAccessToken();
        const response = await apiConnector(
            "DELETE",
            `${API_BASE_URL}/customers/${id}/`,
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
        console.error("Delete customer error:", error);
        toast.error("Customer deletion failed!");
    }
};
