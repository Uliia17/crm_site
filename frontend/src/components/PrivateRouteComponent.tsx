import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const accessToken = useSelector((s: RootState) => s.auth.accessToken);
    const location = useLocation();

    if (!accessToken) {
        // якщо не залогінений — на логін
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};
