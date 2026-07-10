import api from "./api";

export async function getHistory() {
    const response = await api.get("/history");
    return response.data;
}

export async function getHistoryDetail(sessionId) {
    const response = await api.get(`/history/${sessionId}`);
    return response.data;
}
