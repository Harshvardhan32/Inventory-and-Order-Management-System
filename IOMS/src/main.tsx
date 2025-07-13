import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Toaster />
            <App />
        </BrowserRouter>
    </StrictMode>
);
