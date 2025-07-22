import { useEffect, useState } from "react";
import { getAllProduct } from "../../services/apis/productApi";
import { getAllOrder } from "../../services/apis/orderApi";
import type { RevenueCard } from "../../interfaces/interface";
import { Box, Typography } from "@mui/material";
import { getAllCustomer } from "../../services/apis/customerApi";

const DashboardMetrics = () => {
    const [revenue, setRevenue] = useState<RevenueCard[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [orderResponse, productResponse, customerResponse] =
                    await Promise.all([
                        getAllOrder(1, true),
                        getAllProduct(1, true),
                        getAllCustomer(1, true),
                    ]);

                const orders = Array.isArray(orderResponse)
                    ? orderResponse
                    : orderResponse?.results ?? [];

                const products = Array.isArray(productResponse)
                    ? productResponse
                    : productResponse?.results ?? [];

                const customers = Array.isArray(customerResponse)
                    ? customerResponse
                    : customerResponse?.results ?? [];

                const now = new Date();

                const ordersThisMonth = orders.filter((order) => {
                    const orderDate = new Date(order.date);
                    return (
                        orderDate.getMonth() === now.getMonth() &&
                        orderDate.getFullYear() === now.getFullYear()
                    );
                });

                const revenueThisMonth = ordersThisMonth.reduce(
                    (sum: number, order) => {
                        const orderTotal = order.items.reduce(
                            (
                                itemSum: number,
                                item: {
                                    price_at_order_time: number;
                                    quantity: number;
                                }
                            ) =>
                                itemSum +
                                item.price_at_order_time * item.quantity,
                            0
                        );
                        return sum + orderTotal;
                    },
                    0
                );

                const activeProducts = products.filter(
                    (product) => product.stock > 0
                );

                const formatted: RevenueCard[] = [
                    {
                        id: 1,
                        heading: "Order This Month",
                        number: ordersThisMonth.length,
                    },
                    {
                        id: 2,
                        heading: "Revenue This Month",
                        number: `$${revenueThisMonth.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`,
                    },
                    {
                        id: 3,
                        heading: "Active Products",
                        number: activeProducts.length,
                    },
                    {
                        id: 4,
                        heading: "Total Customers",
                        number: customers.length,
                    },
                ];

                setRevenue(formatted);
            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <>
            {revenue?.map((card) => (
                <Box
                    key={card.id}
                    sx={{
                        flex: 1,
                        background: "white",
                        boxShadow: 2,
                        px: 3,
                        py: 4,
                        borderRadius: 1,
                    }}
                >
                    <Typography fontSize={15} sx={{ fontFamily: 700 }}>
                        {card.heading}
                    </Typography>
                    <Typography fontSize={19} sx={{ fontWeight: 600 }}>
                        {card.number}
                    </Typography>
                </Box>
            ))}
        </>
    );
};

export default DashboardMetrics;
