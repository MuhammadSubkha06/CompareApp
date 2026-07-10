import { resolveUploadPath } from "../utils/fileHelper";
import { readCSV } from "./csvReader";
import { readExcel } from "./excelreader";
import { compareRows, detectCompareType } from "./compareEngine";
import { saveCompareSession } from "../repositories/compareRepository";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readRows(storedName, extension, attempt = 1) {

    try {
        const fullPath = resolveUploadPath(storedName);

        if (extension.toLowerCase() === "csv") {
            return await readCSV(fullPath);
        }

        return readExcel(fullPath);
    }
    catch (error) {
        if (attempt < 3) {
            await delay(300 * attempt);
            return readRows(storedName, extension, attempt + 1);
        }

        throw error;
    }
}

export async function runCompare(payload) {

    const { fileA, fileB, primaryKey } = payload;

    if (!fileA?.storedName || !fileB?.storedName) {
        throw new Error("File A dan File B wajib diunggah terlebih dahulu");
    }

    if (!primaryKey) {
        throw new Error("Primary Key wajib dipilih");
    }

    const [rowsA, rowsB] = await Promise.all([
        readRows(fileA.storedName, fileA.extension),
        readRows(fileB.storedName, fileB.extension)
    ]);

    const compareType = detectCompareType(fileA.extension, fileB.extension);

    const { totalRows, match, different, results } = compareRows(rowsA, rowsB, primaryKey);

    const saved = await saveCompareSession({
        fileNameA: fileA.fileName,
        fileNameB: fileB.fileName,
        fileTypeA: fileA.extension,
        fileTypeB: fileB.extension,
        compareType,
        primaryKey,
        totalRows,
        matchRows: match,
        differentRows: different,
        resultJson: JSON.stringify(results)
    });

    return {
        sessionId: saved.Id,
        createdAt: saved.CreatedAt,
        fileNameA: fileA.fileName,
        fileNameB: fileB.fileName,
        compareType,
        primaryKey,
        totalRows,
        match,
        different,
        results
    };
}
