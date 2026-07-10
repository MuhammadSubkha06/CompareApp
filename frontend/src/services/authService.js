import api from "./api";

const TOKEN_KEY = "compareapp_token";
const USER_KEY = "compareapp_user";

export async function login(nomorKepegawaian, password) {
    const response = await api.post("/auth/login", { nomorKepegawaian, password });
    const { token, user } = response.data.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
    return !!getToken();
}