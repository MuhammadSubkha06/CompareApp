import sql from "mssql";
import { getConnection } from "../config/db";


export async function saveCompareSession(data) {

    const db = await getConnection();

    const result = await db.request()
        .input("FileNameA", sql.NVarChar, data.fileNameA)
        .input("FileNameB", sql.NVarChar, data.fileNameB)
        .input("FileTypeA", sql.VarChar, data.fileTypeA)
        .input("FileTypeB", sql.VarChar, data.fileTypeB)
        .input("CompareType", sql.VarChar, data.compareType)
        .input("PrimaryKeyColumn", sql.NVarChar, data.primaryKey)
        .input("TotalRows", sql.Int, data.totalRows)
        .input("MatchRows", sql.Int, data.matchRows)
        .input("DifferentRows", sql.Int, data.differentRows)
        .input("ResultJson", sql.NVarChar(sql.MAX), data.resultJson)
        .query(`
            INSERT INTO CompareSession
                (FileNameA, FileNameB, FileTypeA, FileTypeB, CompareType,
                 PrimaryKeyColumn, TotalRows, MatchRows, DifferentRows, ResultJson, CreatedAt)
            OUTPUT INSERTED.Id, INSERTED.CreatedAt
            VALUES
                (@FileNameA, @FileNameB, @FileTypeA, @FileTypeB, @CompareType,
                 @PrimaryKeyColumn, @TotalRows, @MatchRows, @DifferentRows, @ResultJson, GETDATE())
        `);

    return result.recordset[0];
}

export async function getHistoryList() {

    const db = await getConnection();

    const result = await db.request().query(`
        SELECT
            Id,
            FileNameA,
            FileNameB,
            FileTypeA,
            FileTypeB,
            CompareType,
            PrimaryKeyColumn,
            TotalRows,
            MatchRows,
            DifferentRows,
            CreatedAt
        FROM CompareSession
        ORDER BY CreatedAt DESC
    `);

    return result.recordset;
}

export async function getHistoryById(id) {

    const db = await getConnection();

    const result = await db.request()
        .input("Id", sql.Int, id)
        .query(`
            SELECT *
            FROM CompareSession
            WHERE Id = @Id
        `);

    return result.recordset[0];
}
