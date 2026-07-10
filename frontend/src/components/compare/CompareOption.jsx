function detectCompareType(extA, extB) {

    const isExcel = (ext) => ext === "xlsx" || ext === "xls";
    const isCsv = (ext) => ext === "csv";

    if (isCsv(extA) && isCsv(extB)) return { label: "CSV vs CSV", color: "info" };
    if (isExcel(extA) && isExcel(extB)) return { label: "Excel vs Excel", color: "success" };
    if ((isCsv(extA) && isExcel(extB)) || (isExcel(extA) && isCsv(extB))) {
        return { label: "CSV vs Excel", color: "warning" };
    }

    return { label: "Tidak diketahui", color: "secondary" };
}

export default function CompareOption({
    fileA,
    fileB,
    headers,
    primaryKey,
    onPrimaryKeyChange
}) {

    if (!fileA || !fileB) return null;

    const type = detectCompareType(fileA.extension, fileB.extension);

    return (

        <div className="card mt-4 shadow-sm border-0">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Pengaturan Compare</h6>
                    <span className={`badge bg-${type.color}`}>{type.label}</span>
                </div>

                <label className="form-label small text-muted">
                    Primary Key (kolom acuan untuk mencocokkan baris)
                </label>

                <select
                    className="form-select"
                    value={primaryKey}
                    onChange={(e) => onPrimaryKeyChange(e.target.value)}
                >
                    <option value="">Pilih Primary Key</option>
                    {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>

                <div className="form-text">
                    Kolom ini harus ada di kedua file dan berisi nilai unik (misal: ID, Kode, NIK).
                </div>

            </div>

        </div>

    );

}
