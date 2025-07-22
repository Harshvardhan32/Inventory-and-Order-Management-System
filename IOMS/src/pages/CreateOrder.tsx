import {
    Box,
    Button,
    Checkbox,
    FormControl,
    ListItemText,
    MenuItem,
    Select,
    Typography,
    TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getOrderById,
    createOrder,
    updateOrder,
} from "../services/apis/orderApi";
import type {
    Customer,
    OrderStatus,
    ProductListItem,
} from "../interfaces/interface";
import { getAllCustomer } from "../services/apis/customerApi";
import { getAllProduct } from "../services/apis/productApi";

const schema = z.object({
    customer: z.string().min(1, "Customer is required"),
    status: z.enum(
        ["pending", "processing", "shipped", "delivered", "canceled"],
        {
            required_error: "Status is required",
        }
    ),
    items: z
        .array(
            z.object({
                id: z.string(),
                quantity: z
                    .number({ invalid_type_error: "Quantity is required" })
                    .min(1, "Minimum 1"),
            })
        )
        .min(1, "Select at least one product"),
});

type FormData = z.infer<typeof schema>;

export default function AddOrder() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<ProductListItem[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer: "",
            status: "pending",
            items: [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerResponse, productResponse] = await Promise.all([
                    getAllCustomer(1, true),
                    getAllProduct(1, true),
                ]);

                if (!customerResponse || !productResponse) {
                    throw new Error("Missing customer or product response");
                }

                const customers = Array.isArray(customerResponse)
                    ? customerResponse
                    : customerResponse.results ?? [];

                const products = Array.isArray(productResponse)
                    ? productResponse
                    : productResponse.results ?? [];

                setCustomers(customers);

                const activeProducts = products
                    .filter((product) => product.status === "active")
                    .map((product) => ({
                        ...product,
                        id: String(product.id),
                        stock: product.stock,
                        price: product.price,
                    }));

                setProducts(activeProducts);
            } catch (error) {
                console.error("Failed to fetch customers or products:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!isEdit || !id) {
                setLoading(false);
                return;
            }
            try {
                const order = await getOrderById(id);

                if (order) {
                    reset({
                        customer: String(
                            typeof order.customer === "object"
                                ? order.customer.id
                                : order.customer
                        ),
                        status: order.status.toLowerCase() as
                            | "pending"
                            | "processing"
                            | "shipped"
                            | "delivered"
                            | "canceled",
                        items: order.items.map((item: any) => ({
                            id: String(item.product.id),
                            quantity: item.quantity ?? 1,
                        })),
                    });

                    setProducts((prevProducts) => {
                        const orderProducts = order.items.map((item: any) => ({
                            ...item.product,
                            id: String(item.product.id),
                        }));

                        const mergedProducts = [...prevProducts];
                        orderProducts.forEach((op) => {
                            if (!mergedProducts.some((p) => p.id === op.id)) {
                                mergedProducts.push(op);
                            }
                        });

                        return mergedProducts;
                    });
                }
            } catch (err) {
                console.error("Fetch order failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, isEdit, reset]);

    const onSubmit = async (formData: FormData) => {
        for (const item of formData.items) {
            const product = products.find((p) => String(p.id) === item.id);
            if (!product) {
                toast.error(`Product with id ${item.id} not found.`);
                return;
            }

            if (product.stock === 0) {
                toast.error(`Product "${product.name}" is out of stock.`);
                return;
            }

            if (item.quantity > product.stock) {
                toast.error(
                    `Ordered quantity for "${product.name}" exceeds available stock (${product.stock}).`
                );
                return;
            }
        }

        const payload = {
            ...(isEdit && id ? { id } : {}),

            customer: Number(formData.customer),
            customer_id: Number(formData.customer),
            status: formData.status.toLowerCase() as OrderStatus,
            date: new Date().toISOString(),

            items: formData.items.map((item) => {
                const product = products.find((p) => String(p.id) === item.id);
                return {
                    product_id: Number(item.id),
                    quantity: item.quantity,
                    price_at_order_time: product!.price,
                };
            }),
        };

        const toastId = toast.loading(isEdit ? "Updating..." : "Creating...");
        try {
            if (isEdit && id) {
                await updateOrder(id, payload, navigate);
            } else {
                await createOrder(payload, navigate);
            }
        } catch (e: any) {
            console.error(
                "Save order failed:",
                e.response?.status,
                e.response?.data
            );
            toast.error("Failed to save order.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    if (loading) return <Typography>Loading order...</Typography>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                mt: 4,
            }}
        >
            <Box
                sx={{
                    maxWidth: "80%",
                    width: "100%",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography variant="h5" fontWeight={700}>
                    {isEdit ? "Edit Order" : "New Order"}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            p: 3,
                            boxShadow: 2,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Customer
                                </Typography>
                                <Controller
                                    name="customer"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl
                                            fullWidth
                                            error={!!errors.customer}
                                        >
                                            <Select
                                                {...field}
                                                displayEmpty
                                                disabled={isEdit}
                                            >
                                                <MenuItem disabled value="">
                                                    Select a customer
                                                </MenuItem>
                                                {customers.map((customer) => (
                                                    <MenuItem
                                                        key={customer.id}
                                                        value={String(
                                                            customer.id
                                                        )}
                                                    >
                                                        {customer.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                {errors.customer && (
                                    <Typography color="error" fontSize={13}>
                                        {errors.customer.message}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography fontSize={15} fontWeight={500}>
                                    Status
                                </Typography>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl
                                            fullWidth
                                            error={!!errors.status}
                                        >
                                            <Select {...field}>
                                                {schema.shape.status.options.map(
                                                    (status) => (
                                                        <MenuItem
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                {errors.status && (
                                    <Typography color="error" fontSize={13}>
                                        {errors.status.message}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Controller
                            name="items"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <Typography fontSize={15} fontWeight={500}>
                                        Items
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        error={!!errors.items}
                                    >
                                        <Select
                                            multiple
                                            value={field.value.map(
                                                (item) => item.id
                                            )}
                                            disabled={isEdit}
                                            onChange={(e) => {
                                                const selectedIds =
                                                    e.target.value;
                                                const updatedItems =
                                                    Array.isArray(
                                                        selectedIds
                                                    ) &&
                                                    selectedIds?.map(
                                                        (id: string) => {
                                                            const existing =
                                                                field.value.find(
                                                                    (item) =>
                                                                        item.id ===
                                                                        id
                                                                );
                                                            return (
                                                                existing || {
                                                                    id,
                                                                    quantity: 0,
                                                                }
                                                            );
                                                        }
                                                    );
                                                field.onChange(updatedItems);
                                            }}
                                            renderValue={(selected) => {
                                                return selected
                                                    .map((id) => {
                                                        const product =
                                                            products.find(
                                                                (p) =>
                                                                    String(
                                                                        p.id
                                                                    ) ===
                                                                    String(id)
                                                            );
                                                        return product
                                                            ? product.name
                                                            : `Unknown (${id})`;
                                                    })
                                                    .join(", ");
                                            }}
                                        >
                                            {products.map((product) => (
                                                <MenuItem
                                                    key={product.id}
                                                    value={product.id}
                                                >
                                                    <Checkbox
                                                        checked={field.value.some(
                                                            (item) =>
                                                                String(
                                                                    item.id
                                                                ) ===
                                                                String(
                                                                    product.id
                                                                )
                                                        )}
                                                    />
                                                    <ListItemText
                                                        primary={`${product.name} (Available: ${product.stock})`}
                                                    />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {field.value.map((item, index) => {
                                        const product = products.find(
                                            (p) => String(p.id) === item.id
                                        );
                                        return (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    mt: 1,
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    sx={{ minWidth: 200 }}
                                                >
                                                    {product?.name || "Unknown"}
                                                </Typography>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    disabled={isEdit}
                                                    inputProps={{
                                                        min: 1,
                                                        max:
                                                            product?.stock ||
                                                            undefined,
                                                    }}
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const quantity =
                                                            parseInt(
                                                                e.target.value,
                                                                10
                                                            );
                                                        if (
                                                            !isNaN(quantity) &&
                                                            quantity >= 1
                                                        ) {
                                                            const updated = [
                                                                ...field.value,
                                                            ];
                                                            updated[
                                                                index
                                                            ].quantity =
                                                                quantity;
                                                            field.onChange(
                                                                updated
                                                            );
                                                        }
                                                    }}
                                                />
                                                {product &&
                                                    item.quantity >
                                                        product.stock && (
                                                        <Typography
                                                            color="error"
                                                            fontSize={13}
                                                        >
                                                            Max available:{" "}
                                                            {product.stock}
                                                        </Typography>
                                                    )}
                                            </Box>
                                        );
                                    })}
                                    {errors.items && (
                                        <Typography color="error" fontSize={13}>
                                            {(errors.items as any)?.message}
                                        </Typography>
                                    )}
                                </Box>
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
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ backgroundColor: "blue" }}
                            >
                                {isEdit ? "Update Order" : "Create Order"}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
