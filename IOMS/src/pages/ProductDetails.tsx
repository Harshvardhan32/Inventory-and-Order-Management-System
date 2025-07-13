import { Box, Typography, Paper, Avatar } from "@mui/material";
import {
    PriceChange as PriceIcon,
    Store as StockIcon,
    CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/apis/productApi";
import type { Product } from "../interfaces/interface";

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!id) return setLoading(false);
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const formatDateTime = (iso: string) =>
        new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(iso));

    if (loading) return <Typography>Loading product...</Typography>;
    if (!product)
        return <Typography color="error">Product not found.</Typography>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
                margin: "25px 0",
            }}
        >
            <Box
                sx={{
                    maxWidth: "80%",
                    width: "100%",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Product Details
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box
                            flex="1"
                            sx={{
                                maxWidth: { md: "50%" },
                            }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={2}
                            >
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {product.name.charAt(0)}
                                </Avatar>
                                <Typography variant="h6">
                                    {product.name}
                                </Typography>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                            >
                                <PriceIcon fontSize="small" color="action" />
                                <Typography>${product.price}</Typography>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                            >
                                <StockIcon fontSize="small" color="action" />
                                <Typography>
                                    {product.stock} in stock
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            flex="1"
                            sx={{
                                maxWidth: { md: "50%" },
                            }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={2}
                            >
                                <CalendarTodayIcon
                                    fontSize="small"
                                    color="action"
                                />
                                <Typography>
                                    Created{" "}
                                    {formatDateTime(product.created_at ?? "")}
                                </Typography>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={2}
                            >
                                <CalendarTodayIcon
                                    fontSize="small"
                                    color="action"
                                />
                                <Typography>
                                    Last Updated{" "}
                                    {formatDateTime(product.updated_at ?? "")}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
