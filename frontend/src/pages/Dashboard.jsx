import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import DashboardCard from "../components/DashboardCard";
import { getDashboard } from "../services/dashboardService";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {
            setLoading(true);
            const result = await getDashboard();
            setSummary(result);
        }
        catch {
            console.log("Backend Error");
        }
        finally {
            setLoading(false);
        }
    }

    const chartData = {
        labels: ["Match", "Berbeda"],
        datasets: [
            {
                data: [summary?.MatchRows ?? 0, summary?.DifferentRows ?? 0],
                backgroundColor: ["#198754", "#dc3545"],
                borderWidth: 0
            }
        ]
    };

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="page-title mb-1">Ringkasan Compare</h4>
                    <small className="page-subtitle">Statistik seluruh proses perbandingan file</small>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={loadDashboard} disabled={loading}>
                    <i className={`bi bi-arrow-clockwise me-1 ${loading ? "spin" : ""}`}></i>
                    Refresh
                </button>
            </div>

            <div className="row g-4">

                <div className="col-lg-3 col-sm-6">
                    <DashboardCard
                        title="Total Compare"
                        value={summary?.TotalCompare ?? 0}
                        icon="bi-files"
                        color="primary"
                    />
                </div>

                <div className="col-lg-3 col-sm-6">
                    <DashboardCard
                        title="Total Baris"
                        value={summary?.TotalRows ?? 0}
                        icon="bi-table"
                        color="secondary"
                    />
                </div>

                <div className="col-lg-3 col-sm-6">
                    <DashboardCard
                        title="Match"
                        value={summary?.MatchRows ?? 0}
                        icon="bi-check-circle"
                        color="success"
                    />
                </div>

                <div className="col-lg-3 col-sm-6">
                    <DashboardCard
                        title="Berbeda"
                        value={summary?.DifferentRows ?? 0}
                        icon="bi-exclamation-circle"
                        color="danger"
                    />
                </div>

            </div>

            <div className="row g-4 mt-1">

                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 mb-3"><span className="text-success"><i className="bi bi-pie-chart-fill"></i></span><h6 className="fw-bold mb-0">Proporsi Match vs Berbeda</h6></div>
                            {
                                (summary?.MatchRows || summary?.DifferentRows)
                                    ? <Doughnut data={chartData} />
                                    : <p className="text-muted small mb-0">Belum ada data compare.</p>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                            <div className="d-flex align-items-center gap-2 mb-3"><span className="text-primary"><i className="bi bi-lightning-charge-fill"></i></span><h6 className="fw-bold mb-0">Langkah Cepat</h6></div>
                            <p className="text-muted small">
                                Mulai bandingkan file CSV dengan Excel, atau CSV dengan CSV melalui menu
                                <strong> Compare</strong>. Setiap hasil akan otomatis tercatat di menu
                                <strong> History</strong> lengkap dengan opsi export ke CSV / Excel.
                            </p>
                            <a href="/compare" className="btn btn-primary">
                                <i className="bi bi-plus-circle me-1"></i>
                                Compare File Baru
                            </a>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    );

}
