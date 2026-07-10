import sql from "mssql";

let pool;

export async function getConnection() {
    if (!pool) {
const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            port: parseInt(process.env.DB_PORT, 10),
            database: process.env.DB_DATABASE,

            options: {
                encrypt: false,
                trustServerCertificate: true,
            },

            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },

            connectionTimeout: 30000,
            requestTimeout: 30000,
        };

        pool = await sql.connect(config);
        console.log("✅ Connected to SQL Server");
    }

    return pool;
}