import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import sql from "mssql";
import { getConnection } from "../config/db.js";

const daftarPengguna = [

    { nomorKepegawaian: "198501012010011001", nama: "Muhammad Subkha" },
    { nomorKepegawaian: "199002152012022002", nama: "Budi Petot" },
    // tambahkan pengguna lain di sini
];

async function seed() {
    const db = await getConnection();

    for (const p of daftarPengguna) {
        const passwordHash = await bcrypt.hash(p.nomorKepegawaian, 10);

        const existing = await db.request()
            .input("NomorKepegawaian", sql.VarChar, p.nomorKepegawaian)
            .query(`SELECT Id FROM Pengguna WHERE NomorKepegawaian = @NomorKepegawaian`);

        if (existing.recordset.length > 0) {
            console.log(`Skip, sudah ada: ${p.nomorKepegawaian} (${p.nama})`);
            continue;
        }

        await db.request()
            .input("NomorKepegawaian", sql.VarChar, p.nomorKepegawaian)
            .input("Nama", sql.NVarChar, p.nama)
            .input("PasswordHash", sql.VarChar, passwordHash)
            .query(`
                INSERT INTO Pengguna (NomorKepegawaian, Nama, PasswordHash)
                VALUES (@NomorKepegawaian, @Nama, @PasswordHash)
            `);

        console.log(`✅ Ditambahkan: ${p.nomorKepegawaian} (${p.nama})`);
    }

    console.log("Selesai.");
    process.exit(0);
}

seed().catch(err => {
    console.error("Gagal seed pengguna:", err);
    process.exit(1);
});