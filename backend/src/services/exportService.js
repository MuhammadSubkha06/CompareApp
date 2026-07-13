import * as XLSX from "xlsx";


function flattenResults(detail) {

    const rows = [];

    for (const item of detail.results) {

        if (item.status === "DIFFERENT" && item.differences.length > 0) {

            for (const diff of item.differences) {
                rows.push({
                    [detail.primaryKey]: item.key,
                    Status: item.status,
                    Kolom: diff.column,
                    [`Nilai (${detail.fileNameA})`]: diff.fileA,
                    [`Nilai (${detail.fileNameB})`]: diff.fileB
                });
            }

        }
        else if ((item.status === "ONLY_FILE_A" || item.status === "ONLY_FILE_B") && item.data) {

            const isiData = Object.entries(item.data)
                .map(([col, val]) => `${col}: ${val}`)
                .join(", ");

            rows.push({
                [detail.primaryKey]: item.key,
                Status: item.status,
                Kolom: "",
                [`Nilai (${detail.fileNameA})`]: item.status === "ONLY_FILE_A" ? isiData : "",
                [`Nilai (${detail.fileNameB})`]: item.status === "ONLY_FILE_B" ? isiData : ""
            });
        }
        else {
            rows.push({
                [detail.primaryKey]: item.key,
                Status: item.status,
                Kolom: "",
                [`Nilai (${detail.fileNameA})`]: "",
                [`Nilai (${detail.fileNameB})`]: ""
            });
        }
    }

    return rows;
}

export function buildExportFile(detail, format) {

    const rows = flattenResults(detail);

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const safeName = `compare-${detail.sessionId}`;

    if (format === "csv") {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        return {
            buffer: Buffer.from(csv, "utf-8"),
            contentType: "text/csv; charset=utf-8",
            fileName: `${safeName}.csv`
        };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Compare");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return {
        buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileName: `${safeName}.xlsx`
    };
}