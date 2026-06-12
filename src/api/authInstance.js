import axios from "axios";
const token = localStorage.getItem("token");

const authInstace = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
    headers: {
       Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  withCredentials: false,
});

export default authInstace;
