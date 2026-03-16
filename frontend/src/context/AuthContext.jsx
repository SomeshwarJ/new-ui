import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const persona = localStorage.getItem("persona");
        const fullname = localStorage.getItem("fullname");
        const email = localStorage.getItem("email");
        const department = localStorage.getItem("department");
        if (token && persona) {
            setUser({ token, persona, fullname, email, department });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("persona", data.persona);
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("email", data.email);
        localStorage.setItem("department", data.department || "");
        setUser({ token: data.access_token, persona: data.persona, fullname: data.fullname, email: data.email, department: data.department || "" });
        return data.persona;
    };

    const register = async (fullname, email, password, persona, department) => {
        return await registerUser(fullname, email, password, persona, department);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("persona");
        localStorage.removeItem("fullname");
        localStorage.removeItem("email");
        localStorage.removeItem("department");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
