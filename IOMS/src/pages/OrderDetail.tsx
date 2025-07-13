import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Link,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getOrderById } from "../services/apis/orderApi";
import type { OrderResponse } from "../interfaces/interface";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f5f5f5",
        color: theme.palette.common.black,
        fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
        backgroundColor: "#f5f5f5",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const OrderDetail: React.FC = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await getOrderById(id as string);
                setOrderData(response);
            } catch (err) {
                console.error(err);
                setError("Failed to load order.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    const statusColors: Record<string, { bg: string; color: string }> = {
        "All Orders": { bg: "#e3f2fd", color: "#1976d2" },
        Pending: { bg: "#fff3e0", color: "#f57c00" },
        Processing: { bg: "#fffde7", color: "#fbc02d" },
        Shipped: { bg: "#e3f2fd", color: "#1976d2" },
        Delivered: { bg: "#e8f5e9", color: "#2c7f6f" },
        Canceled: { bg: "#ffebee", color: "#c62828" },
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!orderData) return <Typography>No order data found.</Typography>;

    function formatDateShort(isoString: string) {
        const date = new Date(isoString);
        const datePart = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const timePart = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return `${datePart} | ${timePart}`;
    }

    function capitalizeFirstLetter(str: string) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

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
                <Box
                    width={"100%"}
                    display={"flex"}
                    gap={6}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            component={"p"}
                            fontWeight={600}
                        >
                            Order #{orderData.id}
                        </Typography>
                        <Typography variant="subtitle1" component={"p"}>
                            Placed on {formatDateShort(orderData.date)}
                        </Typography>
                    </Box>
                    <Link
                        component={RouterLink}
                        to="/orders"
                        sx={{
                            backgroundColor: "#E9EAF0",
                            padding: "10px",
                            color: "black",
                            borderRadius: 1,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back to Orders
                    </Link>
                </Box>

                <Box
                    sx={{
                        background: "white",
                        p: 3,
                        display: "flex",
                        gap: 3,
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: 3,
                        border: "none",
                        borderRadius: "6px",
                    }}
                >
                    <Box>
                        <Typography fontWeight={600} fontSize={22}>
                            Status
                        </Typography>
                        <Typography
                            sx={{
                                textTransform: "none",
                                backgroundColor:
                                    statusColors[
                                        capitalizeFirstLetter(orderData.status)
                                    ].bg,
                                color: statusColors[
                                    capitalizeFirstLetter(orderData.status)
                                ].color,
                                fontWeight: 600,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor:
                                        statusColors[
                                            capitalizeFirstLetter(
                                                orderData.status
                                            )
                                        ].bg,
                                    color: statusColors[
                                        capitalizeFirstLetter(orderData.status)
                                    ].color,
                                },
                                fontSize: "14px",
                            }}
                        >
                            {capitalizeFirstLetter(orderData.status)}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            textTransform: "none",
                            color: statusColors[
                                capitalizeFirstLetter(orderData.status)
                            ].color,
                            fontWeight: 600,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor:
                                    statusColors[
                                        capitalizeFirstLetter(orderData.status)
                                    ].bg,
                                color: statusColors[
                                    capitalizeFirstLetter(orderData.status)
                                ].color,
                            },
                            fontSize: "16px",
                        }}
                    >
                        Order{" "}
                        {orderData.status.substring(0, 1).toUpperCase() +
                            orderData.status.substring(
                                1,
                                orderData.status.length
                            )}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        background: "white",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        boxShadow: 3,
                        border: "none",
                        borderRadius: "6px",
                    }}
                >
                    <Typography fontWeight={700} fontSize={22}>
                        Customer Information
                    </Typography>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        position="relative"
                        gap={3}
                    >
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                            <Box>
                                <Typography
                                    sx={{
                                        color: "gray",
                                        fontSize: "16px",
                                    }}
                                >
                                    Name
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "blue",
                                        fontSize: "16px",
                                    }}
                                >
                                    {orderData.customer.name
                                        .substring(0, 1)
                                        .toUpperCase() +
                                        orderData.customer.name.substring(
                                            1,
                                            orderData.customer.name.length
                                        )}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: "gray",
                                        fontSize: "16px",
                                    }}
                                >
                                    Phone
                                </Typography>
                                <Typography>
                                    {orderData.customer.phone}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            position="absolute"
                            left="50%"
                            display={"flex"}
                            flexDirection={"column"}
                            gap={2}
                            sx={{ transform: "translateX(-40%)" }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: "gray",
                                        fontSize: "16px",
                                    }}
                                >
                                    Email
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "blue",
                                        fontSize: "16px",
                                    }}
                                >
                                    {orderData.customer.email}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: "gray",
                                        fontSize: "16px",
                                    }}
                                >
                                    Address
                                </Typography>
                                <Typography>
                                    {orderData.customer.address}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        background: "white",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        boxShadow: 3,
                        border: "none",
                        borderRadius: "6px",
                    }}
                >
                    <Typography fontWeight={700} fontSize={22}>
                        Order Item
                    </Typography>
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 3,
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Table sx={{ minWidth: 700 }} aria-label="orders table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>PRODUCT</StyledTableCell>
                                    <StyledTableCell align="right">
                                        UNIT PRICE
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        QUANTITY
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        SUBTOTAL
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderData.items.map((item) => (
                                    <StyledTableRow key={item.id}>
                                        <StyledTableCell
                                            sx={{
                                                color: "blue",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.product?.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            $
                                            {item.price_at_order_time.toLocaleString()}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="right"
                                            sx={{ color: "blue" }}
                                        >
                                            {item.quantity}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            ${" "}
                                            {(
                                                item.price_at_order_time *
                                                item.quantity
                                            ).toLocaleString()}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                                <StyledTableRow>
                                    <StyledTableCell
                                        colSpan={3}
                                        align="right"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        Total
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        ${" "}
                                        {orderData.items
                                            .reduce(
                                                (acc, item) =>
                                                    acc +
                                                    item.price_at_order_time *
                                                        item.quantity,
                                                0
                                            )
                                            .toLocaleString()}
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderDetail;
