import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout: React.FC = () => {
    return (
        <div>
            <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
                <Link to="/orders">Orders</Link>{" | "}
                <Link to="/login">Login</Link>
            </header>
            <main style={{ padding: 12 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
