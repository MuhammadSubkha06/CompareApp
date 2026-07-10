import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { login } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [nomorKepegawaian, setNomorKepegawaian] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nomorKepegawaian.trim() || !password.trim()) {
            toast.error("Nomor Kepegawaian dan Password wajib diisi");
            return;
        }

        try {
            setLoading(true);
            const user = await login(nomorKepegawaian.trim(), password);
            toast.success(`Selamat datang, ${user.nama || user.nomorKepegawaian}`);
            navigate("/", { replace: true });
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Login gagal, periksa kembali data Anda");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page d-flex align-items-center justify-content-center p-3">
            <div className="card login-card shadow" style={{ width: "100%" }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <span className="login-icon text-primary fs-2"><i className="bi bi-file-earmark-diff"></i></span>
                        <h4 className="mt-3 mb-1 fw-bold">Selamat Datang</h4>
                        <p className="text-secondary small mb-0">Masuk menggunakan Nomor Kepegawaian</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nomor Kepegawaian</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Masukkan Nomor Kepegawaian"
                                value={nomorKepegawaian}
                                onChange={(e) => setNomorKepegawaian(e.target.value)}
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Memproses...
                                </>
                            ) : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
