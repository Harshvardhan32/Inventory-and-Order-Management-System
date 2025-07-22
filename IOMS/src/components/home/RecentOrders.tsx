import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRecentOrders } from "../../services/apis/orderApi";
import type { OrderResponse } from "../../interfaces/interface";

const RecentOrders = () => {
    const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const toastId = toast.loading("Fetching recent orders...");
            try {
                const response = await getRecentOrders();

                setRecentOrders(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error("Error fetching recent orders:", error);
                setRecentOrders([]);
            } finally {
                toast.dismiss(toastId);
            }
        };

        fetchOrders();
    }, []);

    const statusColors: Record<string, { bg: string; color: string }> = {
        pending: { bg: "#fff3e0", color: "#f57c00" },
        processing: { bg: "#fffde7", color: "#fbc02d" },
        shipped: { bg: "#e3f2fd", color: "#1976d2" },
        delivered: { bg: "#e8f5e9", color: "#2c7f6f" },
        canceled: { bg: "#ffebee", color: "#c62828" },
    };

    function formatDateShort(isoString: string) {
        const options: object = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Intl.DateTimeFormat("en-US", options).format(
            new Date(isoString)
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                flex: "1",
                border: "1px solid #e0e0e0",
                padding: 2,
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                mt: 3,
            }}
        >
            <Typography variant="h6" fontWeight={600}>
                Recent Orders
            </Typography>

            <Box sx={{ overflowX: "auto" }}>
                <Box
                    sx={{
                        minWidth: "500px",
                    }}
                    display="grid"
                    gridTemplateColumns="1fr 2fr 1.5fr 1fr 1.5fr"
                    gap={1}
                    px={1}
                    mb={1}
                    borderBottom={"1px solid #000"}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Order ID
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Customer
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Date
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Status
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ textAlign: "right" }}
                    >
                        Total
                    </Typography>
                </Box>

                {recentOrders.length > 0 ? (
                    recentOrders?.map((order) => (
                        <Box
                            key={order.id}
                            display="grid"
                            gridTemplateColumns="1fr 2fr 1.5fr 1fr 1.5fr"
                            alignItems="center"
                            gap={1}
                            px={1}
                            py={1}
                            sx={{
                                borderBottom: "1px solid #000",
                                minWidth: "500px",
                            }}
                        >
                            <Typography color="blue" fontWeight={600}>
                                #{order.id}
                            </Typography>
                            <Typography>{order.customer.name}</Typography>
                            <Typography>
                                {formatDateShort(order.date)}
                            </Typography>
                            <Typography
                                sx={{
                                    backgroundColor:
                                        statusColors[order.status]?.bg ||
                                        "#eee",
                                    color:
                                        statusColors[order.status]?.color ||
                                        "#000",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                    width: "fit-content",
                                }}
                            >
                                {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1).toLowerCase()}
                            </Typography>
                            <Typography
                                fontWeight={600}
                                sx={{ textAlign: "right" }}
                            >
                                $
                                {order.items
                                    .map(
                                        (item) =>
                                            item.price_at_order_time *
                                            item.quantity
                                    )
                                    .reduce((sum, current) => sum + current, 0)
                                    .toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Box textAlign="center" py={2}>
                        <Typography color="text.secondary">
                            No recent orders found.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default RecentOrders;
