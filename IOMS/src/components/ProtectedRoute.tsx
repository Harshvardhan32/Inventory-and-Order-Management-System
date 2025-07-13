import React from "react";
import { Box } from "@mui/material";
import Navbar from "./common/Navbar";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: React.PropsWithChildren<{}>) => {
    const authRaw = localStorage.getItem("auth");
    const auth = authRaw ? JSON.parse(authRaw) : null;

    if (!auth) {
        return <Navigate to="/admin/signin" replace />;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Navbar />
            {props.children}
        </Box>
    );
};

export default ProtectedRoute;
