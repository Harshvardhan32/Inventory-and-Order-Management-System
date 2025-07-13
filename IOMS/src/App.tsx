import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import CustomerDetails from "./pages/CustomerDetails";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import CreateOrder from "./pages/CreateOrder";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { checkAuthExpiration } from "./services/apis/authApi";

function App() {
    useEffect(() => {
        checkAuthExpiration();
    }, []);

    return (
        <Routes>
            <Route path="/admin/signin" element={<SignIn />} />
            <Route path="/admin/signup" element={<SignUp />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <Products />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/:id"
                element={
                    <ProtectedRoute>
                        <ProductDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/new"
                element={
                    <ProtectedRoute>
                        <AddProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/product/edit/:id"
                element={
                    <ProtectedRoute>
                        <AddProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <Customers />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers/:id"
                element={
                    <ProtectedRoute>
                        <CustomerDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers/new"
                element={
                    <ProtectedRoute>
                        <AddCustomer />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer/edit/:id"
                element={
                    <ProtectedRoute>
                        <AddCustomer />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <OrderDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/new"
                element={
                    <ProtectedRoute>
                        <CreateOrder />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/order/edit/:id"
                element={
                    <ProtectedRoute>
                        <CreateOrder />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
