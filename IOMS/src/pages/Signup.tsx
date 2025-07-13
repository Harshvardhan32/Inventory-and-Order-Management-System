import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signUp } from "../services/apis/authApi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
const phoneRegex = /^[0-9]{10}$/;

const schema = z
    .object({
        fullName: z
            .string()
            .min(1, "Full name is required")
            .max(50, "Name is too long"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email address"),
        phoneNumber: z
            .string()
            .min(1, "Phone number is required")
            .regex(phoneRegex, "Phone number must be 10 digits"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                passwordRegex,
                "Password must include uppercase, lowercase, number, and special character"
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () =>
        setShowConfirmPassword((prev) => !prev);

    const onSubmit = async (data: FormData) => {
        const formData = {
            name: data.fullName,
            email: data.email,
            phone_number: data.phoneNumber,
            password: data.password,
            confirm_password: data.confirmPassword,
        };

        try {
            await signUp(formData, navigate);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    maxWidth: "400px",
                    width: "100%",
                    boxShadow: 3,
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    marginTop: 2,
                    marginBottom: 2,
                }}
            >
                <Box textAlign="center">
                    <Typography variant="h5" fontWeight={600}>
                        IOMS
                    </Typography>
                    <Typography fontSize={14}>
                        Inventory & Order Management System
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <FieldWrapper
                            label="Full Name"
                            error={!!errors.fullName}
                            errorMessage={errors.fullName?.message}
                        >
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        size="small"
                                        fullWidth
                                        error={!!errors.fullName}
                                    />
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="Email"
                            error={!!errors.email}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        size="small"
                                        fullWidth
                                        error={!!errors.email}
                                    />
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="Phone Number"
                            error={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                        >
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        size="small"
                                        fullWidth
                                        type="tel"
                                        inputProps={{ maxLength: 10 }}
                                        error={!!errors.phoneNumber}
                                    />
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="Password"
                            error={!!errors.password}
                            errorMessage={errors.password?.message}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        size="small"
                                        fullWidth
                                        error={!!errors.password}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={
                                                            toggleShowPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="Confirm Password"
                            error={!!errors.confirmPassword}
                            errorMessage={errors.confirmPassword?.message}
                        >
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        size="small"
                                        fullWidth
                                        error={!!errors.confirmPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={
                                                            toggleShowConfirmPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </FieldWrapper>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: "blue",
                                color: "white",
                                textTransform: "none",
                                boxShadow: 2,
                                width: "100%",
                            }}
                        >
                            Sign Up
                        </Button>

                        <Typography textAlign="center">
                            Already have an account?{" "}
                            <Link to="/admin/signin">Sign in</Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

interface FieldWrapperProps {
    label: string;
    error: boolean;
    errorMessage?: string;
    children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
    label,
    error,
    errorMessage,
    children,
}) => (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography variant="subtitle1" fontSize={15} fontWeight={500}>
            {label}
        </Typography>
        {children}
        {error && (
            <Typography variant="caption" color="error" mt={0.5}>
                {errorMessage}
            </Typography>
        )}
    </Box>
);

export default SignUp;
