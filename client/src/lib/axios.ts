"use client";
import axios from "axios"

const instance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://neowallet.onrender.com/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://neowallet.onrender.com/api",
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance

