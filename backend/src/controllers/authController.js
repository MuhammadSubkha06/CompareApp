import { login } from "../services/authService";

export async function loginController(body) {
    return await login({
        nomorKepegawaian: body?.nomorKepegawaian,
        password: body?.password
    });
}