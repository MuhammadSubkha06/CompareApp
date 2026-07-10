import { getConnection } from "../config/db";

export async function getDashboardSummary() {
    const db = await getConnection();

    const result = await db.request().query(`
        SELECT
            COUNT(*) AS TotalCompare,
            SUM(TotalRows) AS TotalRows,
            SUM(MatchRows) AS MatchRows,
            SUM(DifferentRows) AS DifferentRows
        FROM CompareSession
    `);

    return result.recordset[0];
}