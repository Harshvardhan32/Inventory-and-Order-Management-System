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
import { deleteProductById, getAllProduct } from "../services/apis/productApi";
import type { Product } from "../interfaces/interface";
import ConfirmationModal from "../components/common/ConfirmationModal";
import toast from "react-hot-toast";

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f5f5f5",
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

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("All Products");
    const [products, setProducts] = useState<Product[]>([]);
    const [id, setId] = useState<number>();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const page = parseInt(searchParams.get("page") || "1", 10);

    const statusOptions = [
        "All Products",
        "Active",
        "Inactive",
        "Low Stock",
        "Out of Stock",
    ];

    const statusColors: Record<string, { bg: string; color: string }> = {
        "All Products": { bg: "#e3f2fd", color: "#1976d2" },
        Active: { bg: "#fff3e0", color: "#f57c00" },
        Inactive: { bg: "#fffde7", color: "#fbc02d" },
        "Low Stock": { bg: "#fff3e0", color: "#f57c00" },
        "Out of Stock": { bg: "#ffebee", color: "#c62828" },
    };

    const fetchProducts = async (pageNumber: number) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await getAllProduct(pageNumber);
            if (response) {
                setProducts(response.results);
                const totalCount = response.count;
                setTotalPages(Math.ceil(totalCount / 10));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            toast.dismiss(toastId);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setSearchParams({ page: value.toString() });
    };

    const formatNumber = (value: number): string =>
        value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const displayStock = (stock: number) => {
        if (stock === 0) return "Out of Stock";
        if (stock <= 10) return `${stock} (Low)`;
        return stock.toString();
    };

    const filterProductsByStatus = (products: Product[], filter: string) => {
        switch (filter) {
            case "Active":
                return products.filter((p) => p.status === "active");
            case "Inactive":
                return products.filter((p) => p.status === "inactive");
            case "Low Stock":
                return products.filter((p) => p.stock > 0 && p.stock <= 10);
            case "Out of Stock":
                return products.filter((p) => p.stock === 0);
            case "All Products":
            default:
                return products;
        }
    };

    const filteredProducts = filterProductsByStatus(products, status);

    const deleteProduct = async (id: number | undefined) => {
        if (!id) {
            toast.error("Product ID is missing!");
            return;
        }
        const toastId = toast.loading("Deleting...");
        try {
            await deleteProductById(String(id));
            toast.success("Product Deleted!");
            setShowConfirmationModal(false);
            fetchProducts(page);
        } catch (error) {
            toast.error("Product deletion failed!");
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
                    Products
                </Typography>
                <Link
                    component={RouterLink}
                    to="/products/new"
                    sx={{
                        backgroundColor: "blue",
                        padding: "10px",
                        color: "white",
                        borderRadius: 1,
                        textDecoration: "none",
                    }}
                >
                    Add New Product
                </Link>
            </Box>

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
                {statusOptions?.map((option) => (
                    <Button
                        key={option}
                        sx={{
                            textTransform: "none",
                            backgroundColor:
                                status === option
                                    ? statusColors[option].bg
                                    : "transparent",
                            color:
                                status === option
                                    ? statusColors[option].color
                                    : "inherit",
                            fontWeight: status === option ? 700 : 400,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: statusColors[option].bg,
                                color: statusColors[option].color,
                            },
                            border: "none",
                        }}
                        onClick={() => setStatus(option)}
                    >
                        {option}
                    </Button>
                ))}
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
                        boxShadow: 3,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Table sx={{ minWidth: 700 }} aria-label="products table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>NAME</StyledTableCell>
                                <StyledTableCell>SKU</StyledTableCell>
                                <StyledTableCell>PRICE</StyledTableCell>
                                <StyledTableCell>STOCK</StyledTableCell>
                                <StyledTableCell align="right">
                                    STATUS
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    ACTIONS
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredProducts?.map((product) => (
                                <StyledTableRow key={product.SKU}>
                                    <StyledTableCell
                                        sx={{ color: "blue", fontWeight: 600 }}
                                    >
                                        {product.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {product.SKU}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 600 }}>
                                        ${formatNumber(product.price)}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <Typography
                                            sx={{
                                                display: "inline-block",
                                                color:
                                                    product.stock === 0
                                                        ? "#c62828"
                                                        : product.stock <= 10
                                                        ? "#f57c00"
                                                        : "#2c7f6f",
                                                fontWeight: 600,
                                                fontSize: "0.95em",
                                            }}
                                        >
                                            {displayStock(product.stock)}
                                        </Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="right">
                                        <Typography
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                backgroundColor:
                                                    product.status === "active"
                                                        ? "lightgreen"
                                                        : "#f8d7da",
                                                color:
                                                    product.status === "active"
                                                        ? "green"
                                                        : "red",
                                                fontWeight: 600,
                                                fontSize: "0.95em",
                                                display: "inline-block",
                                            }}
                                        >
                                            {product.status === "active"
                                                ? "Active"
                                                : "Inactive"}
                                        </Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="right">
                                        <Button
                                            component={RouterLink}
                                            to={`/products/${product.id}`}
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
                                            to={`/product/edit/${product.id}`}
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
                                                setShowConfirmationModal(true);
                                                setId(product.id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}

                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <StyledTableCell colSpan={6} align="center">
                                        No products found.
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
                        text2: "All the data will be deleted for this product.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => deleteProduct(id),
                        btn2Handler: () => setShowConfirmationModal(false),
                        isOpen: showConfirmationModal,
                    }}
                />
            )}
        </Box>
    );
};

export default Products;
