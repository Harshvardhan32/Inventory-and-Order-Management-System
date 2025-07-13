import {
    Box,
    Typography,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Chip,
} from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    CalendarToday as CalendarTodayIcon,
    ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerById } from "../services/apis/customerApi";
import type { Customer } from "../interfaces/interface";

export default function CustomerDetails() {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!id) return setLoading(false);
            try {
                const data = await getCustomerById(id);
                setCustomer(data);
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

    if (loading) return <Typography>Loading customer...</Typography>;
    if (!customer)
        return <Typography color="error">Customer not found.</Typography>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "screen",
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
                    gap: "5px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box width={"100%"}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Customer Details
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
                                        {customer.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6">
                                        {customer.name}
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    mb={1}
                                >
                                    <EmailIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                    <Typography>{customer.email}</Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    mb={1}
                                >
                                    <PhoneIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                    <Typography>{customer.phone}</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                    <LocationOnIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                    <Typography>{customer.address}</Typography>
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
                                        Joined{" "}
                                        {formatDateTime(customer.created_at)}
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
                                        {formatDateTime(customer.updated_at)}
                                    </Typography>
                                </Box>

                                <Chip
                                    icon={<ShoppingCartIcon />}
                                    label={`Total Orders: ${customer.orders.length}`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box width={"100%"}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Orders
                    </Typography>

                    {customer.orders.length === 0 ? (
                        <Typography>No orders placed.</Typography>
                    ) : (
                        <Paper variant="outlined">
                            <List>
                                {customer.orders.map((order) => (
                                    <Box key={order.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        component="span"
                                                        fontWeight={600}
                                                    >
                                                        Order ID:{" "}
                                                        {order.order_id}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                        >
                                                            Status:{" "}
                                                            <strong>
                                                                {order.status}
                                                            </strong>
                                                        </Typography>
                                                        <br />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                        >
                                                            Date:{" "}
                                                            {formatDateTime(
                                                                order.date
                                                            )}
                                                        </Typography>
                                                        <br />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                        >
                                                            Total Items:{" "}
                                                            {order.total_items}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
