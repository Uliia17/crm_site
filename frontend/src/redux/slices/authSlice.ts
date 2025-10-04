import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: { _id?: string; email?: string; role?: string } | null;
}

const initialState: AuthState = {
    accessToken: typeof window !== "undefined" ? localStorage.getItem("access") : null,
    refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh") : null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) {
            state.accessToken = action.payload.accessToken;
            if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
            localStorage.setItem("access", state.accessToken ?? "");
            if (state.refreshToken) localStorage.setItem("refresh", state.refreshToken);
        },
        clearAuth(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
        setUser(state, action: PayloadAction<{ _id?: string; email?: string; role?: string } | null>) {
            state.user = action.payload;
        },
    },
});

export const { setTokens, clearAuth, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
