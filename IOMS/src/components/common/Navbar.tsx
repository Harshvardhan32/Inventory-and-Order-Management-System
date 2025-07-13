import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { logout } from "../../services/apis/authApi";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
    const navigate = useNavigate();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    return (
        <AppBar position="static" sx={{ backgroundColor: "blue" }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    IOMS
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        component={Link}
                        sx={{ textTransform: "none", fontSize: "16px" }}
                        to="/"
                    >
                        Dashboard
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        sx={{ textTransform: "none", fontSize: "16px" }}
                        to="/products"
                    >
                        Products
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        sx={{ textTransform: "none", fontSize: "16px" }}
                        to="/customers"
                    >
                        Customers
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        sx={{ textTransform: "none", fontSize: "16px" }}
                        to="/orders"
                    >
                        Orders
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => setShowConfirmationModal(true)}
                        sx={{ textTransform: "none", fontSize: "16px" }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
            {showConfirmationModal && (
                <ConfirmationModal
                    modalData={{
                        text1: "Are you sure?",
                        text2: "You will be logged out from your account.",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: () => logout(navigate),
                        btn2Handler: () => setShowConfirmationModal(false),
                        isOpen: showConfirmationModal,
                    }}
                />
            )}
        </AppBar>
    );
};

export default Navbar;
