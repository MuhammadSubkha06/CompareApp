import { verifyToken } from "../services/authService";

export function requireAuth(request) {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return Response.json(
            { success: false, message: "Belum login / token tidak ditemukan" },
            { status: 401 }
        );
    }

    try {
        verifyToken(token);
        return null;
    }
    catch {
        return Response.json(
            { success: false, message: "Sesi login sudah habis, silakan login ulang" },
            { status: 401 }
        );
    }
}