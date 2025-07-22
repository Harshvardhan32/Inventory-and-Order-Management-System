import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Typography, Pagination } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Link from "@mui/material/Link";
import { useEffect, useState } from "react";
import { getAllOrder } from "../services/apis/orderApi";
import type { OrderResponse } from "../interfaces/interface";

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f5f5f5",
        color: "#75786D",
        fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": { backgroundColor: theme.palette.action.hover },
    "&:hover": { backgroundColor: "#f5f5f5" },
    "&:last-child td, &:last-child th": { border: 0 },
}));

const Orders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState("All Orders");
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const page = parseInt(searchParams.get("page") || "1", 10);

    const statusOptions = [
        "All Orders",
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Canceled",
    ];

    const statusColors: Record<string, { bg: string; color: string }> = {
        "All Orders": { bg: "#e3f2fd", color: "#1976d2" },
        Pending: { bg: "#fff3e0", color: "#f57c00" },
        Processing: { bg: "#fffde7", color: "#fbc02d" },
        Shipped: { bg: "#e3f2fd", color: "#1976d2" },
        Delivered: { bg: "#e8f5e9", color: "#2c7f6f" },
        Canceled: { bg: "#ffebee", color: "#c62828" },
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const resp = await getAllOrder(page, false, status);
                if (resp) {
                    setOrders(resp.results);
                    setTotalPages(Math.ceil(resp.count / 4));
                } else {
                    setOrders([]);
                    setTotalPages(0);
                }
            } catch (err) {
                console.error(err);
                setOrders([]);
                setTotalPages(0);
            }
        };

        fetchOrders();
    }, [page, status]);

    const handlePageChange = (_: any, value: number) => {
        setSearchParams({ page: value.toString() });
    };

    const formatDateShort = (iso: string) =>
        new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(iso));

    const forTitleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
                    flexWrap: "wrap",
                    gap: "5px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Orders
                </Typography>
                <Link
                    component={RouterLink}
                    to="/orders/new"
                    sx={{
                        bgcolor: "blue",
                        p: 1,
                        color: "white",
                        borderRadius: 1,
                        textDecoration: "none",
                    }}
                >
                    Create New Order
                </Link>
            </Box>

            {/* Status Filter */}
            <Box
                sx={{
                    maxWidth: "80%",
                    width: "100%",
                    margin: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2px",
                    boxShadow: 3,
                    padding: "5px",
                    borderRadius: "6px",
                }}
            >
                {statusOptions.map((opt) => (
                    <Button
                        key={opt}
                        sx={{
                            textTransform: "none",
                            bgcolor:
                                status === opt
                                    ? statusColors[opt].bg
                                    : "transparent",
                            color:
                                status === opt
                                    ? statusColors[opt].color
                                    : "inherit",
                            fontWeight: status === opt ? 700 : 400,
                            borderRadius: 2,
                            "&:hover": {
                                bgcolor: statusColors[opt].bg,
                                color: statusColors[opt].color,
                            },
                        }}
                        onClick={() => {
                            setStatus(opt);
                            setSearchParams({ page: "1" }); // Reset to page 1
                        }}
                    >
                        {opt}
                    </Button>
                ))}
            </Box>

            {/* Orders Table */}
            <Box
                sx={{
                    maxWidth: "80%",
                    width: "100%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <TableContainer
                    component={Paper}
                    sx={{ boxShadow: 3, border: "1px solid #e0e0e0" }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ORDER #</StyledTableCell>
                                <StyledTableCell>DATE</StyledTableCell>
                                <StyledTableCell>CUSTOMER</StyledTableCell>
                                <StyledTableCell>STATUS</StyledTableCell>
                                <StyledTableCell align="right">
                                    ITEMS
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    TOTAL
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    ACTIONS
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <StyledTableRow key={order.id}>
                                        <StyledTableCell
                                            sx={{
                                                color: "blue",
                                                fontWeight: 600,
                                            }}
                                        >
                                            #{order.id}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatDateShort(order.date)}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ color: "blue" }}>
                                            {order.customer.name}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor:
                                                        statusColors[
                                                            forTitleCase(
                                                                order.status
                                                            )
                                                        ]?.bg || "#eeeeee",
                                                    color:
                                                        statusColors[
                                                            forTitleCase(
                                                                order.status
                                                            )
                                                        ]?.color || "#000000",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {forTitleCase(order.status)}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {order.items.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="right"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {order.items
                                                .reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        parseFloat(
                                                            item.price_at_order_time
                                                        ) *
                                                            item.quantity,
                                                    0
                                                )
                                                .toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                })}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button
                                                component={RouterLink}
                                                to={`/orders/${order.id}`}
                                                size="small"
                                                sx={{
                                                    color: "green",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                component={RouterLink}
                                                to={`/order/edit/${order.id}`}
                                                size="small"
                                                sx={{
                                                    color: "blue",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <StyledTableCell colSpan={7} align="center">
                                        No orders found.
                                    </StyledTableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Pagination */}
            {orders.length > 0 && (
                <Box
                    sx={{
                        maxWidth: "80%",
                        mx: "auto",
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
};

export default Orders;
