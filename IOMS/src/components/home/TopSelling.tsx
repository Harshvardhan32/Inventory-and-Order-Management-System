import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTopSellingProducts } from "../../services/apis/productApi";
import type { Product } from "../../interfaces/interface";

const TopSelling = () => {
    const [topProducts, setTopProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            const toastId = toast.loading("Fetching top products...");
            try {
                const response = await getTopSellingProducts();
                if (response?.length) {
                    setTopProducts(response);
                }
            } catch (error) {
                console.error("Error fetching top products:", error);
            } finally {
                toast.dismiss(toastId);
            }
        };

        fetchTopProducts();
    }, []);

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
            }}
        >
            <Typography variant="h6" fontWeight={600}>
                Top 5 Selling Products
            </Typography>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    gap={2}
                    mb={1}
                    px={1}
                    borderBottom={"1px solid #000"}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Products
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Units Sold
                    </Typography>
                </Box>

                {topProducts && topProducts.length > 0 ? (
                    topProducts.map((product) => (
                        <Box
                            key={product.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            px={1}
                            py={1.2}
                            sx={{
                                borderBottom: "1px solid #000",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "blue",
                                    fontWeight: 600,
                                }}
                            >
                                {product.name}
                            </Typography>
                            <Typography
                                sx={{
                                    color: "blue",
                                    fontWeight: 600,
                                }}
                            >
                                {product.units_sold}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Box textAlign="center" py={2}>
                        <Typography color="text.secondary">
                            No products found.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default TopSelling;
