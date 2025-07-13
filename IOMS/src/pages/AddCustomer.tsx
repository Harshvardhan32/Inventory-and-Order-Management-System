import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createCustomer,
    getCustomerById,
    updateCustomer,
} from "../services/apis/customerApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const schema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^\d{10,15}$/, "Phone must contain only digits"),

    address: z
        .string()
        .min(1, "Address is required")
        .max(255, "Address must be less than 300 characters"),
});

type FormData = z.infer<typeof schema>;

export default function AddCustomer() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
        },
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customer = await getCustomerById(id!);

                if (customer) {
                    reset({
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        address: customer.address,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch customer", err);
            } finally {
                setLoading(false);
            }
        };

        if (isEdit) {
            fetchCustomer();
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (formData: FormData) => {
        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
        };

        let toastId;
        try {
            toastId = toast.loading(isEdit ? "Updating..." : "Creating...");

            if (isEdit && id) {
                await updateCustomer(id, data, navigate);
                toast.success("Customer Updated!");
            } else {
                await createCustomer(data, navigate);
                toast.success("Customer Created!");
            }
        } catch (error) {
            console.error("Error saving customer:", error);
            toast.error("Something went wrong");
        } finally {
            toast.dismiss(toastId);
        }
    };

    if (loading) return <Typography>Loading customer data...</Typography>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
                margin: "25px 0px",
            }}
        >
            <Box
                sx={{
                    maxWidth: "80%",
                    width: "100%",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {isEdit ? "Edit Customer" : "New Customer"}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            backgroundColor: "#fff",
                            boxShadow: 2,
                            p: 3,
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Name
                                </Typography>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    boxShadow: 1,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Email
                                </Typography>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    boxShadow: 1,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Phone
                                </Typography>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    boxShadow: 1,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Address
                                </Typography>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.address}
                                            helperText={errors.address?.message}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    boxShadow: 1,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ textTransform: "none" }}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: "blue",
                                }}
                            >
                                {isEdit ? "Update Customer" : "Create Customer"}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
