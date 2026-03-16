const API_URL = "http://127.0.0.1:8000/auth";

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
    }
    return response.json();
};

export const registerUser = async (fullname, email, password, persona, department) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password, persona, department }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
    }
    return response.json();
};
