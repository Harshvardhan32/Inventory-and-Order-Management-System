import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createProduct,
    getProductById,
    updateProduct,
} from "../services/apis/productApi";
import type { Product } from "../interfaces/interface";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z
        .string()
        .min(1, "Price is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Price must be a positive number",
        }),
    SKU: z.string().min(1, "SKU is required"),
    stock: z
        .string()
        .min(1, "Stock quantity is required")
        .refine((val) => Number.isInteger(Number(val)) && Number(val) >= 0, {
            message: "Stock must be a non-negative integer",
        }),
    status: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddProduct() {
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
            price: "",
            SKU: "",
            stock: "",
            status: true,
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const prod = await getProductById(id!);
                if (prod) {
                    reset({
                        name: prod.name,
                        price: prod.price.toString(),
                        SKU: prod.SKU,
                        stock: prod.stock.toString(),
                        status: prod.status === "active",
                    });
                }
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (isEdit) {
            fetchProduct();
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (formData: FormData) => {
        const data: Product = {
            name: formData.name,
            price: Number(formData.price),
            SKU: formData.SKU,
            stock: Number(formData.stock),
            status: formData.status ? "active" : "inactive",
        };

        let toastId;
        try {
            if (isEdit && id) {
                toastId = toast.loading("Updating...");
                await updateProduct(id, data);
                toast.success("Product Updated!");
            } else {
                toastId = toast.loading("Creating...");
                await createProduct(data);
                toast.success("Product Created!");
            }
            navigate("/products");
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            toast.dismiss(toastId);
        }
    };

    if (loading) return <Typography>Loading product data...</Typography>;

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
                    {isEdit ? "Edit Product" : "New Product"}
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
                                    Price
                                </Typography>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            placeholder="$ 0.00"
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
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
                                    SKU
                                </Typography>
                                <Controller
                                    name="SKU"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.SKU}
                                            helperText={errors.SKU?.message}
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
                                    Stock quantity
                                </Typography>
                                <Controller
                                    name="stock"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            fullWidth
                                            error={!!errors.stock}
                                            helperText={errors.stock?.message}
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

                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                        />
                                    }
                                    label="Active"
                                    sx={{
                                        alignItems: "center",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        width: "fit-content",
                                    }}
                                />
                            )}
                        />

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
                                {isEdit ? "Update Product" : "Create Product"}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
