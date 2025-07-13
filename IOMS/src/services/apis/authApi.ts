import apiConnector from "../apiConnector";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type SignupForm = {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
};

export const checkAuthExpiration = () => {
    const authData = JSON.parse(localStorage.getItem("auth") || "null");

    if (authData) {
        const currentTime = Date.now();

        if (currentTime >= authData.expires_at) {
            localStorage.removeItem("auth");
        }
    }
};
export const refreshAccessToken = async () => {
    try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        const refreshToken = auth?.refresh;

        if (!refreshToken) throw new Error("No refresh token found");

        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/api/token/refresh/`,
            { refresh: refreshToken },
            { "Content-Type": "application/json" }
        );

        const newAccessToken = (response.data as { access: string }).access;

        const updatedAuth = {
            ...auth,
            access: newAccessToken,
        };

        localStorage.setItem("auth", JSON.stringify(updatedAuth));

        return true;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        localStorage.removeItem("auth");

        return false;
    }
};

export const signUp = async (
    formData: SignupForm,
    navigate: (path: string) => void
) => {
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/auth/register/`,
            formData,
            { "Content-Type": "application/json" }
        );

        console.log("Signup Data: ", response);
        if (response.status !== 201) {
            throw new Error("Something went wrong!");
        }

        toast.dismiss(toastId);
        toast.success("Registration successfull!");
        navigate("/admin/signin");
    } catch (error: any) {
        console.log("Error message: ", error.message);
        toast.dismiss(toastId);
        toast.error("Registration failed!");
    }
};

interface LoginForm {
    email: string;
    password: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user: {
        email: string;
        full_name: string;
        phone_number: string;
    };
}

export const signIn = async (formData: LoginForm) => {
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "POST",
            `${API_BASE_URL}/auth/login/`,
            formData,
            { "Content-Type": "application/json" }
        );

        const data = response.data as LoginResponse;
        const expiresAt = new Date().getTime() + 1 * 60 * 60 * 1000;

        localStorage.setItem(
            "auth",
            JSON.stringify({
                access: data.access,
                refresh: data.refresh,
                user: data.user,
                expires_at: expiresAt,
            })
        );

        toast.dismiss(toastId);
        toast.success("Login Successfully!");
    } catch (error) {
        toast.dismiss(toastId);
        toast.error("Login failed");
        console.error("Login error:", error);
    }
};

export const logout = (navigate: (path: string) => void) => {
    localStorage.removeItem("auth");
    toast.success("Logout successfully!");
    navigate("/admin/signin");
};
