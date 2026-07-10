import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export async function saveFile(file) {

    const uploadDir = path.join(process.cwd(), "src", "uploads");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const extension = file.name.split(".").pop();

    const fileName = `${uuid()}.${extension}`;

    const fullPath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(fullPath, buffer);

    return {
        fileName,
        fullPath,
        extension,
        buffer
    };

}

export function resolveUploadPath(storedName) {

    const uploadDir = path.join(process.cwd(), "src", "uploads");
    const fullPath = path.join(uploadDir, storedName);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`File tidak ditemukan di server: ${storedName}`);
    }

    return fullPath;
}