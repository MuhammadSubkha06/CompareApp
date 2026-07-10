import { saveFile } from "../utils/fileHelper";
import { readCSVBuffer } from "./csvReader";
import { readExcelBuffer } from "./excelreader";

export async function upload(file) {

    const saved = await saveFile(file);

    let rows = [];

    if (saved.extension.toLowerCase() === "csv") {
        rows = await readCSVBuffer(saved.buffer);
    }
    else {
        rows = readExcelBuffer(saved.buffer);
    }

    return {

        fileName: file.name,

        storedName: saved.fileName,

        extension: saved.extension,

        size: file.size,

        headers: Object.keys(rows[0] || {}),

        preview: rows.slice(0, 20),

        totalRows: rows.length

    };

}
