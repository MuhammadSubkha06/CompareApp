import { useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const statusMeta = {
    MATCH: {
        label: "Sama",
        color: "success",
        icon: "bi-check-circle-fill",
        desc: "Data pada kedua file identik, tidak ada perbedaan."
    },
    DIFFERENT: {
        label: "Berbeda",
        color: "danger",
        icon: "bi-exclamation-triangle-fill",
        desc: "Baris ditemukan di kedua file, tapi ada nilai kolom yang berbeda."
    },
    ONLY_FILE_A: {
        label: "Hanya di File A",
        color: "warning",
        icon: "bi-file-earmark-arrow-left-fill",
        desc: "Baris ini hanya ditemukan di File A, tidak ada pasangannya di File B."
    },
    ONLY_FILE_B: {
        label: "Hanya di File B",
        color: "info",
        icon: "bi-file-earmark-arrow-up-fill",
        desc: "Baris ini hanya ditemukan di File B, tidak ada pasangannya di File A."
    }
};

const FILTERS = ["ALL", "MATCH", "DIFFERENT", "ONLY_FILE_A", "ONLY_FILE_B"];

function formatDate(value) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }
    catch {
        return value;
    }
}

function fileIcon(fileName = "") {
    if (fileName.toLowerCase().endsWith(".csv")) {
        return { icon: "bi-filetype-csv", color: "text-primary" };
    }
    return { icon: "bi-file-earmark-excel", color: "text-success" };
}

export default function HistoryDetailModal({ show, onHide, detail, loading }) {

    const [filterStatus, setFilterStatus] = useState("ALL");
    const [search, setSearch] = useState("");

    const counts = useMemo(() => {

        const base = { ALL: 0, MATCH: 0, DIFFERENT: 0, ONLY_FILE_A: 0, ONLY_FILE_B: 0 };

        if (!detail?.results) return base;

        detail.results.forEach(row => {
            base.ALL += 1;
            base[row.status] = (base[row.status] || 0) + 1;
        });

        return base;

    }, [detail]);

    const filteredRows = useMemo(() => {

        if (!detail?.results) return [];

        return detail.results.filter(row => {
            const matchStatus = filterStatus === "ALL" || row.status === filterStatus;
            const matchSearch = search === "" ||
                String(row.key).toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });

    }, [detail, filterStatus, search]);

    const iconA = fileIcon(detail?.fileNameA);
    const iconB = fileIcon(detail?.fileNameB);

    return (

        <Modal show={show} onHide={onHide} size="lg" centered scrollable>

            <Modal.Header closeButton>
                <Modal.Title className="fs-5">
                    <i className="bi bi-file-earmark-diff me-2 text-primary"></i>
                    Detail Compare {detail ? `#${detail.sessionId}` : ""}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {
                    loading &&
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                        <div className="text-muted small mt-2">Memuat detail hasil compare...</div>
                    </div>
                }

                {
                    !loading && detail &&
                    <>
                        <div className="border rounded-3 p-3 mb-3 bg-light-subtle">
                            <div className="row g-2 small">
                                <div className="col-md-6">
                                    <i className={`bi ${iconA.icon} ${iconA.color} me-1`}></i>
                                    <strong>File A:</strong> {detail.fileNameA}
                                </div>
                                <div className="col-md-6">
                                    <i className={`bi ${iconB.icon} ${iconB.color} me-1`}></i>
                                    <strong>File B:</strong> {detail.fileNameB}
                                </div>
                                <div className="col-md-4">
                                    <i className="bi bi-key-fill text-secondary me-1"></i>
                                    <strong>Primary Key:</strong> {detail.primaryKey}
                                </div>
                                <div className="col-md-4">
                                    <i className="bi bi-diagram-3 text-secondary me-1"></i>
                                    <strong>Jenis:</strong> {detail.compareType}
                                </div>
                                <div className="col-md-4">
                                    <i className="bi bi-clock-history text-secondary me-1"></i>
                                    <strong>Waktu:</strong> {formatDate(detail.createdAt)}
                                </div>
                            </div>
                        </div>

                        <div className="row g-2 mb-3 text-center">
                            {FILTERS.map(status => {
                                const meta = status === "ALL"
                                    ? { label: "Total Baris", color: "dark", icon: "bi-list-columns-reverse" }
                                    : statusMeta[status];

                                return (
                                    <div className="col-6 col-md" key={status}>
                                        <div
                                            role="button"
                                            onClick={() => setFilterStatus(status)}
                                            className={`border rounded-3 p-2 h-100 ${filterStatus === status ? `border-${meta.color} border-2` : ""}`}
                                        >
                                            <div className={`fw-bold fs-5 text-${meta.color}`}>
                                                {counts[status] || 0}
                                            </div>
                                            <small className="text-muted">
                                                <i className={`bi ${meta.icon} me-1`}></i>
                                                {meta.label}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                            <div className="btn-group flex-wrap">
                                {FILTERS.map(status => (
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
                                placeholder={`Cari ${detail.primaryKey}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="table-responsive" style={{ maxHeight: "420px" }}>
                            <table className="table table-sm table-bordered table-hover align-middle mb-0 table-sticky">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "18%" }}>{detail.primaryKey}</th>
                                        <th style={{ width: "20%" }}>Status</th>
                                        <th>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((row, index) => {

                                        const meta = statusMeta[row.status];

                                        return (
                                            <tr key={index} className={`row-status-${meta.color}`}>
                                                <td className="fw-semibold">{row.key}</td>
                                                <td>
                                                    <span className={`badge status-badge bg-${meta.color}`}>
                                                        <i className={`bi ${meta.icon} me-1`}></i>
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td>

                                                    {
                                                        row.status === "MATCH" &&
                                                        <span className="text-muted small">
                                                            Tidak ada perbedaan pada baris ini.
                                                        </span>
                                                    }

                                                    {
                                                        row.status === "DIFFERENT" && row.differences?.length > 0 &&
                                                        <div className="diff-table">
                                                            {row.differences.map((d, i) => (
                                                                <div className="diff-row" key={i}>
                                                                    <div className="diff-field">{d.column}</div>
                                                                    <div className="diff-values">
                                                                        <span className="diff-old" title={detail.fileNameA}>
                                                                            {String(d.fileA) || "(kosong)"}
                                                                        </span>
                                                                        <i className="bi bi-arrow-right-short diff-arrow"></i>
                                                                        <span className="diff-new" title={detail.fileNameB}>
                                                                            {String(d.fileB) || "(kosong)"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }

                                                    {
                                                        (row.status === "ONLY_FILE_A" || row.status === "ONLY_FILE_B") &&
                                                        <>
                                                            <div className="small text-muted mb-1">
                                                                {meta.desc}
                                                            </div>
                                                            {
                                                                row.data && Object.keys(row.data).length > 0 &&
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
                                        );
                                    })}

                                    {
                                        filteredRows.length === 0 &&
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted py-4">
                                                <i className="bi bi-inbox fs-4 d-block mb-1"></i>
                                                Tidak ada data yang cocok dengan filter/pencarian
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Legenda */}
                        <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
                            {FILTERS.filter(s => s !== "ALL").map(status => (
                                <span key={status}>
                                    <span className={`badge status-badge bg-${statusMeta[status].color} me-1`}>
                                        <i className={`bi ${statusMeta[status].icon}`}></i>
                                    </span>
                                    {statusMeta[status].desc}
                                </span>
                            ))}
                        </div>
                    </>
                }

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Tutup</Button>
            </Modal.Footer>

        </Modal>

    );

}