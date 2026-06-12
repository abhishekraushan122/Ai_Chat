import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import authInstace from "../api/authInstance";
import { endpoints } from "../api/endpoint";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = React.useState({
    email: "",
    password:""
  })
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await authInstace.post(endpoints.login, {
      email: login.email, 
      password: login.password,
    });
    console.log(res);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Login failed");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={login.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={login.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
