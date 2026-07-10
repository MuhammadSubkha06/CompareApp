import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import HistoryTable from "../components/history/HistoryTable";
import HistoryDetailModal from "../components/history/HistoryDetailModal";

import { getHistory, getHistoryDetail } from "../services/historyService";

export default function History() {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {

        try {
            setLoading(true);

            const response = await getHistory();

            if (!response.success) {
                throw new Error(response.message || "Gagal memuat riwayat");
            }

            setRows(response.data);
        }
        catch (error) {
            toast.error(error.message || "Gagal memuat riwayat compare");
        }
        finally {
            setLoading(false);
        }
    }

    async function handleViewDetail(sessionId) {

        try {
            setShowModal(true);
            setLoadingDetail(true);

            const response = await getHistoryDetail(sessionId);

            if (!response.success) {
                throw new Error(response.message || "Gagal memuat detail");
            }

            setDetail(response.data);
        }
        catch (error) {
            toast.error(error.message || "Gagal memuat detail compare");
            setShowModal(false);
        }
        finally {
            setLoadingDetail(false);
        }
    }

    const filteredRows = useMemo(() => {

        return rows.filter(row => {

            const matchType = typeFilter === "ALL" || row.compareType === typeFilter;

            const keyword = search.toLowerCase();
            const matchSearch = search === "" ||
                row.fileNameA.toLowerCase().includes(keyword) ||
                row.fileNameB.toLowerCase().includes(keyword);

            return matchType && matchSearch;
        });

    }, [rows, search, typeFilter]);

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="page-title mb-1">History Compare</h4>
                    <small className="page-subtitle">Riwayat seluruh proses perbandingan file</small>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={loadHistory} disabled={loading}>
                    <i className={`bi bi-arrow-clockwise me-1 ${loading ? "spin" : ""}`}></i>
                    Refresh
                </button>
            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body p-4">

                    <div className="d-flex flex-wrap gap-2 mb-3">

                        <div className="input-group input-group-sm" style={{ maxWidth: "260px" }}>
                            <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Cari nama file..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select form-select-sm"
                            style={{ maxWidth: "180px" }}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="ALL">Semua Jenis</option>
                            <option value="CSV vs CSV">CSV vs CSV</option>
                            <option value="CSV vs Excel">CSV vs Excel</option>
                            <option value="Excel vs Excel">Excel vs Excel</option>
                        </select>

                        <span className="ms-auto small text-muted align-self-center">
                            {filteredRows.length} dari {rows.length} riwayat
                        </span>

                    </div>

                    {
                        loading
                            ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            )
                            : <HistoryTable rows={filteredRows} onViewDetail={handleViewDetail} />
                    }

                </div>

            </div>

            <HistoryDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                detail={detail}
                loading={loadingDetail}
            />

        </div>

    );

}
