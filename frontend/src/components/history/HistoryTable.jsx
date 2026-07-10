import { buildExportUrl } from "../../services/compareService";

const typeColor = {
    "CSV vs CSV": "info",
    "CSV vs Excel": "warning",
    "Excel vs Excel": "success"
};

export default function HistoryTable({ rows, onViewDetail }) {

    if (rows.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                Belum ada riwayat compare
            </div>
        );
    }

    return (

        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>File A</th>
                        <th>File B</th>
                        <th>Jenis</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Match</th>
                        <th className="text-center">Berbeda</th>
                        <th>Tanggal</th>
                        <th className="text-end">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.sessionId}>
                            <td>{row.sessionId}</td>
                            <td className="text-truncate" style={{ maxWidth: "160px" }}>
                                <i className="bi bi-file-earmark me-1 text-muted"></i>
                                {row.fileNameA}
                            </td>
                            <td className="text-truncate" style={{ maxWidth: "160px" }}>
                                <i className="bi bi-file-earmark me-1 text-muted"></i>
                                {row.fileNameB}
                            </td>
                            <td>
                                <span className={`badge bg-${typeColor[row.compareType] || "secondary"}`}>
                                    {row.compareType}
                                </span>
                            </td>
                            <td className="text-center">{row.totalRows}</td>
                            <td className="text-center text-success fw-semibold">{row.match}</td>
                            <td className="text-center text-danger fw-semibold">{row.different}</td>
                            <td className="small text-muted">
                                {new Date(row.createdAt).toLocaleString("id-ID")}
                            </td>
                            <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => onViewDetail(row.sessionId)}
                                        title="Lihat Detail"
                                    >
                                        <i className="bi bi-eye"></i>
                                    </button>
                                    <button
                                        className="btn btn-outline-success dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        title="Export"
                                    >
                                        <i className="bi bi-download"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <a className="dropdown-item" href={buildExportUrl(row.sessionId, "xlsx")}>
                                                <i className="bi bi-file-earmark-excel me-2 text-success"></i>
                                                Excel (.xlsx)
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href={buildExportUrl(row.sessionId, "csv")}>
                                                <i className="bi bi-filetype-csv me-2 text-primary"></i>
                                                CSV (.csv)
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );

}
