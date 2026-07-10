import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByNomorKepegawaian } from "../repositories/authRepository";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "8h";

export async function login({ nomorKepegawaian, password }) {
    if (!nomorKepegawaian || !password) {
        const err = new Error("Nomor Kepegawaian dan Password wajib diisi");
        err.status = 400;
        throw err;
    }

    const user = await getUserByNomorKepegawaian(nomorKepegawaian.trim());

    if (!user) {
        const err = new Error("Nomor Kepegawaian atau Password salah");
        err.status = 401;
        throw err;
    }

    if (!user.IsActive) {
        const err = new Error("Akun tidak aktif, hubungi admin");
        err.status = 403;
        throw err;
    }

    const isValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isValid) {
        const err = new Error("Nomor Kepegawaian atau Password salah");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        { id: user.Id, nomorKepegawaian: user.NomorKepegawaian, nama: user.Nama },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        user: { id: user.Id, nomorKepegawaian: user.NomorKepegawaian, nama: user.Nama }
    };
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}