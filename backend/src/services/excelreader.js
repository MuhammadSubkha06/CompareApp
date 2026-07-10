import * as XLSX from "xlsx";
import fs from "fs";

function sheetToRows(worksheet) {

    const raw = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false
    });

    if (raw.length === 0) return [];

    let headerRowIndex = raw.findIndex(row =>
        row.filter(cell => cell !== "" && cell !== null && cell !== undefined).length >= 2
    );

    if (headerRowIndex === -1) headerRowIndex = 0;

    const headerRow = raw[headerRowIndex];

    const headers = headerRow.map((h, idx) => {
        const label = (h ?? "").toString().trim();
        return label !== "" ? label : `Kolom_${idx + 1}`;
    });

    const dataRows = raw.slice(headerRowIndex + 1);

    return dataRows.map(row => {
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = row[idx] ?? "";
        });
        return obj;
    });
}


export function readExcel(filePath) {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return sheetToRows(worksheet);
}

export function readExcelBuffer(buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return sheetToRows(worksheet);
}