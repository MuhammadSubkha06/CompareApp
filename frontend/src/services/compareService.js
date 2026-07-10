import api from "./api";

export async function uploadFile(file) {

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/compare/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
}

export async function runCompare(fileA, fileB, primaryKey) {

    const response = await api.post("/compare", {
        fileA: {
            fileName: fileA.fileName,
            storedName: fileA.storedName,
            extension: fileA.extension
        },
        fileB: {
            fileName: fileB.fileName,
            storedName: fileB.storedName,
            extension: fileB.extension
        },
        primaryKey
    });

    return response.data;
}

export function buildExportUrl(sessionId, format) {
    return `/api/history/${sessionId}/export?format=${format}`;
}
