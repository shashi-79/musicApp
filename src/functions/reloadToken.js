'use client'
import axios from "axios";

 const reloadToken = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const refreshToken = localStorage.getItem("refreshToken");

            const tokenData = await axios.post("/auth/api/token", {
                userId,
                refreshToken
            });

            localStorage.setItem("accessToken", tokenData.data.accessToken);
            localStorage.setItem("refreshToken", tokenData.data.refreshToken);
        } catch (error) {
            console.error("Token refresh failed:", error);
            alert("Session expired. Please log in again.");
            window.location.href = "/auth/";
        }
    };

export default reloadToken;