import { Modal, Button } from "react-bootstrap";

const statusMeta = {
    MATCH: { label: "Match", color: "success" },
    DIFFERENT: { label: "Berbeda", color: "danger" },
    ONLY_FILE_A: { label: "Hanya di File A", color: "warning" },
    ONLY_FILE_B: { label: "Hanya di File B", color: "info" }
};

export default function HistoryDetailModal({ show, onHide, detail, loading }) {

    return (

        <Modal show={show} onHide={onHide} size="lg" centered scrollable>

            <Modal.Header closeButton>
                <Modal.Title className="fs-5">
                    Detail Compare {detail ? `#${detail.sessionId}` : ""}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {
                    loading &&
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                    </div>
                }

                {
                    !loading && detail &&
                    <>
                        <div className="row g-2 mb-3 small">
                            <div className="col-6"><strong>File A:</strong> {detail.fileNameA}</div>
                            <div className="col-6"><strong>File B:</strong> {detail.fileNameB}</div>
                            <div className="col-6"><strong>Primary Key:</strong> {detail.primaryKey}</div>
                            <div className="col-6"><strong>Jenis:</strong> {detail.compareType}</div>
                        </div>

                        <div className="table-responsive" style={{ maxHeight: "400px" }}>
                            <table className="table table-sm table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>{detail.primaryKey}</th>
                                        <th>Status</th>
                                        <th>Detail Perbedaan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.results.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.key}</td>
                                            <td>
                                                <span className={`badge status-badge bg-${statusMeta[row.status].color}`}>
                                                    {statusMeta[row.status].label}
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    row.differences?.length > 0
                                                        ? (
                                                            <ul className="mb-0 ps-3 small">
                                                                {row.differences.map((d, i) => (
                                                                    <li key={i}>
                                                                        <strong>{d.column}</strong>:{" "}
                                                                        <span className="text-danger">{String(d.fileA)}</span>
                                                                        {" "}<i className="bi bi-arrow-right"></i>{" "}
                                                                        <span className="text-success">{String(d.fileB)}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )
                                                        : <span className="text-muted small">-</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
