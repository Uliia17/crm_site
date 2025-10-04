import { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "CRM Programming School",
        version: "1.0.0",
        description: "API documentation for Admin, Managers and Auth",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local server",
        },
    ],
    tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Admin", description: "Admin endpoints" },
        { name: "Managers", description: "Managers endpoints" },
    ],
    paths: {
        // ---------- AUTH ----------
        "/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        format: "password",
                                    },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "User successfully logged in" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authenticated user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "User profile returned" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh access token",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Tokens refreshed" },
                    "401": { description: "Unauthorized" },
                },
            },
        },

        // ---------- ADMIN ----------

        // ---------- MANAGERS ----------
    },

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};

export { swaggerDocument };
