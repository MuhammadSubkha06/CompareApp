import {
    getHistoryList,
    getHistoryById
} from "../repositories/compareRepository";

/**
 * Daftar riwayat compare untuk halaman History (ringkas, tanpa detail baris).
 */
export async function listHistory() {

    const rows = await getHistoryList();

    return rows.map(row => ({
        sessionId: row.Id,
        fileNameA: row.FileNameA,
        fileNameB: row.FileNameB,
        fileTypeA: row.FileTypeA,
        fileTypeB: row.FileTypeB,
        compareType: row.CompareType,
        primaryKey: row.PrimaryKeyColumn,
        totalRows: row.TotalRows,
        match: row.MatchRows,
        different: row.DifferentRows,
        createdAt: row.CreatedAt
    }));
}

export async function getHistoryDetail(id) {

    const row = await getHistoryById(id);

    if (!row) return null;

    return {
        sessionId: row.Id,
        fileNameA: row.FileNameA,
        fileNameB: row.FileNameB,
        fileTypeA: row.FileTypeA,
        fileTypeB: row.FileTypeB,
        compareType: row.CompareType,
        primaryKey: row.PrimaryKeyColumn,
        totalRows: row.TotalRows,
        match: row.MatchRows,
        different: row.DifferentRows,
        createdAt: row.CreatedAt,
        results: JSON.parse(row.ResultJson || "[]")
    };
}
