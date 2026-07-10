/**
 * compareEngine.js
 * Logic inti untuk membandingkan 2 kumpulan data (rowsA vs rowsB)
 * berdasarkan sebuah Primary Key.
 *
 * Dipakai oleh: services/compareService.js
 */

function normalize(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim().toLowerCase();
}

/**
 * Mendeteksi jenis perbandingan berdasarkan ekstensi 2 file.
 * @param {string} extA
 * @param {string} extB
 */
export function detectCompareType(extA, extB) {
    const a = (extA || "").toLowerCase();
    const b = (extB || "").toLowerCase();

    const isExcel = (ext) => ext === "xlsx" || ext === "xls";
    const isCsv = (ext) => ext === "csv";

    if (isCsv(a) && isCsv(b)) return "CSV vs CSV";
    if (isExcel(a) && isExcel(b)) return "Excel vs Excel";
    if ((isCsv(a) && isExcel(b)) || (isExcel(a) && isCsv(b))) return "CSV vs Excel";

    return "Unknown";
}

export function compareRows(rowsA, rowsB, primaryKey) {

    const mapA = new Map();
    const mapB = new Map();

    rowsA.forEach(r => {
        mapA.set(normalize(r[primaryKey]), r);
    });

    rowsB.forEach(r => {
        mapB.set(normalize(r[primaryKey]), r);
    });

    const allKeys = new Set([
        ...mapA.keys(),
        ...mapB.keys()
    ]);

    const results = [];

    let match = 0;
    let different = 0;

    for (const key of allKeys) {

        const rowA = mapA.get(key);
        const rowB = mapB.get(key);

        if (!rowA) {
            results.push({
                key: rowB[primaryKey],
                status: "ONLY_FILE_B",
                differences: []
            });
            different++;
            continue;
        }

        if (!rowB) {
            results.push({
                key: rowA[primaryKey],
                status: "ONLY_FILE_A",
                differences: []
            });
            different++;
            continue;
        }

        const allColumns = new Set([
            ...Object.keys(rowA),
            ...Object.keys(rowB)
        ]);

        const diff = [];

        for (const column of allColumns) {

            const valA = rowA[column];
            const valB = rowB[column];

            if (normalize(valA) !== normalize(valB)) {
                diff.push({
                    column,
                    fileA: valA ?? "",
                    fileB: valB ?? ""
                });
            }
        }

        if (diff.length === 0) {
            match++;
            results.push({
                key: rowA[primaryKey],
                status: "MATCH",
                differences: []
            });
        }
        else {
            different++;
            results.push({
                key: rowA[primaryKey],
                status: "DIFFERENT",
                differences: diff
            });
        }
    }

    return {
        totalRows: allKeys.size,
        match,
        different,
        results
    };
}
