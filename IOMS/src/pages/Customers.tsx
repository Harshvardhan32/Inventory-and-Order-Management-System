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
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
    deleteCustomerById,
    getAllCustomer,
} from "../services/apis/customerApi";
import type { Customer } from "../interfaces/interface";
import toast from "react-hot-toast";

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#F1F1F3",
        color: "#75786D",
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

const Customers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>();

    const page = parseInt(searchParams.get("page") || "1", 10);

    const fetchAllCustomer = async (page: number) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await getAllCustomer(page);
            setCustomers(response.results);
            setTotalPages(Math.ceil(response.count / 10));
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to load customers");
        } finally {
            toast.dismiss(toastId);
        }
    };

    useEffect(() => {
        fetchAllCustomer(page);
    }, [page]);

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        setSearchParams({ page: newPage.toString() });
    };

    const deleteCustomer = async (id: number | undefined) => {
        if (!id) {
            toast.error("Customer ID is missing!");
            return;
        }
        const toastId = toast.loading("Deleting...");
        try {
            await deleteCustomerById(String(id));
            toast.success("Customer deleted!");
            setShowConfirmationModal(false);
            fetchAllCustomer(page);
        } catch (error) {
            toast.error("Customer deletion failed!");
        } finally {
            toast.dismiss(toastId);
        }
    };

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
                <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                    Customers
                </Typography>
                <Link
                    component={RouterLink}
                    to="/customers/new"
                    sx={{
                        backgroundColor: "blue",
                        padding: "10px",
                        color: "white",
                        borderRadius: 1,
                        textDecoration: "none",
                    }}
                >
                    Add New Customer
                </Link>
            </Box>

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
                    sx={{
                        boxShadow: 2,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>NAME</StyledTableCell>
                                <StyledTableCell align="right">
                                    EMAIL
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    PHONE
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    ORDERS
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    ACTIONS
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers && customers.length > 0 ? (
                                customers.map((customer) => (
                                    <StyledTableRow key={customer.id}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {customer.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {customer.email}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {customer.phone}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {customer.orders.length}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Box>
                                                <Button
                                                    component={RouterLink}
                                                    to={`/customers/${customer.id}`}
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
                                                    to={`/customer/edit/${customer.id}`}
                                                    sx={{
                                                        textTransform: "none",
                                                        color: "blue",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        textTransform: "none",
                                                        color: "red",
                                                        fontWeight: 600,
                                                    }}
                                                    onClick={() => {
                                                        setSelectedCustomerId(
                                                            customer.id
                                                        );
                                                        setShowConfirmationModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <StyledTableCell colSpan={5} align="center">
                                        No customers found.
                                    </StyledTableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box
                sx={{
                    maxWidth: "80%",
                    margin: "auto",
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

            {showConfirmationModal && (
                <ConfirmationModal
                    modalData={{
                        text1: "Are you sure?",
                        text2: "All the data will be deleted for this customer.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => deleteCustomer(selectedCustomerId),
                        btn2Handler: () => setShowConfirmationModal(false),
                        isOpen: showConfirmationModal,
                    }}
                />
            )}
        </Box>
    );
};

export default Customers;
