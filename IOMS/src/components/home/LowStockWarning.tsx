import { Box, Paper, Typography } from "@mui/material";
import type { Product } from "../../interfaces/interface";

const LowStockWarning = ({
    lowStockProducts,
}: {
    lowStockProducts: Product[];
}) => {
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Typography fontWeight={600}>Low Stock Products</Typography>
                <Typography
                    sx={{
                        fontWeight: 600,
                        px: 1,
                        borderRadius: 1,
                        color:
                            lowStockProducts.length > 10
                                ? "#2c7f6f"
                                : lowStockProducts.length > 0
                                ? "#f57c00"
                                : "#c62828",
                        backgroundColor:
                            lowStockProducts.length > 10
                                ? "#e8f5e9"
                                : lowStockProducts.length > 0
                                ? "#fff3e0"
                                : "#ffebee",
                    }}
                >
                    {lowStockProducts.length}
                </Typography>
            </Box>

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
                        Product
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Stock
                    </Typography>
                </Box>

                {lowStockProducts.length > 0 ? (
                    lowStockProducts?.map((product) => (
                        <Box
                            key={product.id}
                            display="flex"
                            justifyContent="space-between"
                            gap={2}
                            alignItems="center"
                            px={1}
                            py={1.2}
                            sx={{
                                borderBottom: "1px solid #000",
                            }}
                        >
                            <Typography fontWeight={600}>
                                {product.name}
                            </Typography>
                            <Typography
                                color="error"
                                fontWeight={600}
                                sx={{
                                    color:
                                        product.stock > 0
                                            ? "#f57c00"
                                            : "#c62828",
                                }}
                            >
                                {product.stock}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Box textAlign="center" py={2}>
                        <Typography color="text.secondary">
                            All products are sufficiently stocked.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default LowStockWarning;
