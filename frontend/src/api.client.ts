import axios from "axios";

const API_BASE = process.env.REACT_APP_BASE_URL || ""; // dev proxy in CRA
const client = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Пропідключаємо access token перед кожним запитом (якщо є)
client.interceptors.request.use((cfg) => {
    try {
        const token = localStorage.getItem("access");
        if (token && cfg.headers) {
            cfg.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore
    }
    return cfg;
});

export default client;
