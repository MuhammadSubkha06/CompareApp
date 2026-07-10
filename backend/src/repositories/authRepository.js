import sql from "mssql";
import { getConnection } from "../config/db";

export async function getUserByNomorKepegawaian(nomorKepegawaian) {
    const db = await getConnection();

    const result = await db.request()
        .input("NomorKepegawaian", sql.VarChar, nomorKepegawaian)
        .query(`
            SELECT Id, NomorKepegawaian, Nama, PasswordHash, IsActive
            FROM Pengguna
            WHERE NomorKepegawaian = @NomorKepegawaian
        `);

    return result.recordset[0];
}