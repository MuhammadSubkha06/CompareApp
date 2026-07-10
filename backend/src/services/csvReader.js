import fs from "fs";
import { Readable } from "stream";
import csv from "csv-parser";

export function readCSV(filePath) {

    return new Promise((resolve, reject) => {

        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", row => {
                rows.push(row);
            })
            .on("end", () => {
                resolve(rows);
            })
            .on("error", reject);

    });

}

export function readCSVBuffer(buffer) {

    return new Promise((resolve, reject) => {

        const rows = [];

        Readable.from(buffer)
            .pipe(csv())
            .on("data", row => {
                rows.push(row);
            })
            .on("end", () => {
                resolve(rows);
            })
            .on("error", reject);

    });

}
