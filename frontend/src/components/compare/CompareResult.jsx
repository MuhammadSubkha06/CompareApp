import { useMemo, useState } from "react";
import { buildExportUrl } from "../../services/compareService";

const statusMeta = {
    MATCH: { label: "Sama", color: "success", icon: "bi-check-circle-fill", desc: "Data identik di kedua file." },
    DIFFERENT: { label: "Berbeda", color: "danger", icon: "bi-exclamation-triangle-fill", desc: "Ada nilai kolom yang berbeda." },
    ONLY_FILE_A: { label: "Hanya di File A", color: "warning", icon: "bi-file-earmark-arrow-left-fill", desc: "Baris tidak ditemukan di File B." },
    ONLY_FILE_B: { label: "Hanya di File B", color: "info", icon: "bi-file-earmark-arrow-up-fill", desc: "Baris tidak ditemukan di File A." }
};

export default function CompareResult({ result, fileNameA, fileNameB }) {

    const [filterStatus, setFilterStatus] = useState("ALL");
    const [search, setSearch] = useState("");

    const filteredRows = useMemo(() => {
        return result.results.filter(row => {
            const matchStatus = filterStatus === "ALL" || row.status === filterStatus;
            const matchSearch = search === "" || String(row.key).toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [result.results, filterStatus, search]);

    return (
        <div className="card mt-4 shadow-sm border-0">
            <div className="card-body">

                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                        <h5 className="mb-1">Hasil Compare</h5>
                        <small className="text-muted">
                            {fileNameA} <i className="bi bi-arrow-left-right mx-1"></i> {fileNameB}
                        </small>
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-download me-1"></i>
                            Export
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item" href={buildExportUrl(result.sessionId, "xlsx")}>
                                    <i className="bi bi-file-earmark-excel me-2 text-success"></i>
                                    Excel (.xlsx)
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href={buildExportUrl(result.sessionId, "csv")}>
                                    <i className="bi bi-filetype-csv me-2 text-primary"></i>
                                    CSV (.csv)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row g-3 mb-3 text-center">
                    <div className="col-6 col-md-3">
                        <div className="border rounded p-2 h-100">
                            <div className="fw-bold fs-5">{result.totalRows}</div>
                            <small className="text-muted">Total Baris</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="border rounded p-2 h-100">
                            <div className="fw-bold fs-5 text-success">{result.match}</div>
                            <small className="text-muted">Match</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="border rounded p-2 h-100">
                            <div className="fw-bold fs-5 text-danger">{result.different}</div>
                            <small className="text-muted">Berbeda</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="border rounded p-2 h-100">
                            <div className="fw-bold fs-5">{result.compareType}</div>
                            <small className="text-muted">Jenis Compare</small>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                    <div className="btn-group">
                        {["ALL", "MATCH", "DIFFERENT", "ONLY_FILE_A", "ONLY_FILE_B"].map(status => (
                            <button
                                key={status}
                                className={`btn btn-sm ${filterStatus === status ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === "ALL" ? "Semua" : statusMeta[status].label}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        className="form-control form-control-sm ms-auto"
                        style={{ maxWidth: "220px" }}
                        placeholder={`Cari ${result.primaryKey}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="table-responsive" style={{ maxHeight: "420px" }}>
                    <table className="table table-bordered table-sm table-hover table-sticky mb-0">
                        <thead>
                            <tr>
                                <th>{result.primaryKey}</th>
                                <th>Status</th>
                                <th>Detail Perbedaan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row, index) => (
                                <tr key={index} className={`row-status-${statusMeta[row.status].color}`}>
                                    <td className="fw-semibold">{row.key}</td>
                                    <td>
                                        <span className={`badge status-badge bg-${statusMeta[row.status].color}`}>
                                            <i className={`bi ${statusMeta[row.status].icon} me-1`}></i>
                                            {statusMeta[row.status].label}
                                        </span>
                                    </td>
                                    <td>
                                        {row.status === "MATCH" &&
                                            <span className="text-muted small">Tidak ada perbedaan.</span>
                                        }

                                        {row.status === "DIFFERENT" && row.differences?.length > 0 &&
                                            <div className="diff-table">
                                                {row.differences.map((d, i) => (
                                                    <div className="diff-row" key={i}>
                                                        <div className="diff-field">{d.column}</div>
                                                        <div className="diff-values">
                                                            <span className="diff-old">{String(d.fileA) || "(kosong)"}</span>
                                                            <i className="bi bi-arrow-right-short diff-arrow"></i>
                                                            <span className="diff-new">{String(d.fileB) || "(kosong)"}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        }

                                        {(row.status === "ONLY_FILE_A" || row.status === "ONLY_FILE_B") &&
                                            <>
                                                <div className="small text-muted mb-1">{statusMeta[row.status].desc}</div>
                                                {row.data && Object.keys(row.data).length > 0 &&
                                                    <div className="only-data-grid">
                                                        {Object.entries(row.data).map(([col, val]) => (
                                                            <span className="only-data-chip" key={col}>
                                                                <span className="text-muted">{col}:</span> {String(val) || "(kosong)"}
                                                            </span>
                                                        ))}
                                                    </div>
                                                }
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))}

                            {filteredRows.length === 0 &&
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-3">
                                        Tidak ada data yang cocok dengan filter
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}