import { Box, Typography } from "@mui/material";
import MonthlyRevenueChart from "../components/home/MonthlyRevenueChart";
import TopSelling from "../components/home/TopSelling";
import LowStockWarning from "../components/home/LowStockWarning";
import RecentOrders from "../components/home/RecentOrders";
import { useEffect, useState } from "react";
import type {
    MonthlyRevenue,
    OrderResponse,
    Product,
} from "../interfaces/interface";
import { getAllProduct } from "../services/apis/productApi";
import { getAllOrder } from "../services/apis/orderApi";
import DashboardMetrics from "../components/home/DashboardMetrics";

const LOW_STOCK_THRESHOLD = 10;

const Dashboard = () => {
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [data, setData] = useState<MonthlyRevenue[]>([]);

    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const allProductsResponse = await getAllProduct(1, true);

                if (allProductsResponse && Array.isArray(allProductsResponse)) {
                    const filtered = allProductsResponse.filter(
                        (product) => product.stock < LOW_STOCK_THRESHOLD
                    );
                    setLowStockProducts(filtered);
                } else {
                    console.error("No products array found in response");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        const fetchMonthlyRevenue = async () => {
            try {
                const response = await getAllOrder(1, true);
                if (!response) throw new Error("Failed to fetch orders");

                const orders: OrderResponse[] = Array.isArray(response)
                    ? response
                    : response.results;

                if (!orders) throw new Error("Orders data missing");

                const monthlyMap = new Map<string, number>();

                orders.forEach((order) => {
                    const date = new Date(order.date);
                    const label = date.toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                    });

                    const total = order.items.reduce((sum, item) => {
                        return sum + item.price_at_order_time * item.quantity;
                    }, 0);

                    if (monthlyMap.has(label)) {
                        monthlyMap.set(label, monthlyMap.get(label)! + total);
                    } else {
                        monthlyMap.set(label, total);
                    }
                });

                const formattedData: MonthlyRevenue[] = Array.from(
                    monthlyMap,
                    ([label, value]) => ({
                        label,
                        value: parseFloat(value.toFixed(2)),
                    })
                ).sort(
                    (a, b) =>
                        new Date(`1 ${a.label}`).getTime() -
                        new Date(`1 ${b.label}`).getTime()
                );

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching monthly revenue:", error);
            }
        };

        fetchLowStockProducts();
        fetchMonthlyRevenue();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
                margin: "25px 0px 25px 0px",
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
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
                    Dashboard
                </Typography>
                <Box
                    display={"flex"}
                    flexWrap={"wrap"}
                    gap={2}
                    justifyContent={"space-between"}
                >
                    <DashboardMetrics />
                </Box>
                <Box
                    sx={{
                        background: "white",
                        boxShadow: 2,
                        p: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Monthly Revnue
                    </Typography>
                    <MonthlyRevenueChart data={data} />
                </Box>
                <Box
                    width={"100%"}
                    display={"flex"}
                    gap={6}
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                >
                    <TopSelling />
                    <LowStockWarning lowStockProducts={lowStockProducts} />
                </Box>
                <Box width={"100%"} display={"flex"}>
                    <RecentOrders />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
