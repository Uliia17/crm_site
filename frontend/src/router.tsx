import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import { PrivateRoute } from "./components/PrivateRouteComponent";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <div>Сторінку не знайдено (404)</div>,
        children: [
            { path: "login", element: <LoginPage /> },
            {
                path: "orders",
                element: (
                    <PrivateRoute>
                        <OrdersPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export default router;
