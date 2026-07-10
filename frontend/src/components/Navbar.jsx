import { useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../services/authService";

export default function Navbar() {

    const navigate = useNavigate();

    const user = getCurrentUser();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (

        <nav
            className="navbar app-navbar sticky-top"
            style={{
                backgroundImage: "url('/denso/Background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >

            <div className="container-fluid">

                <button className="btn btn-light border d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-label="Buka menu">
                    <i className="bi bi-list fs-5"></i>
                </button>
                <img
                    src="/denso/Header.png"
                    alt="CompareApp"
                    className="navbar-logo"
                />

                <div className="d-flex align-items-center gap-4">

                    <button type="button" className="btn btn-light border rounded-circle notification-button" title="Notifikasi">
                        <i className="bi bi-bell text-secondary"></i>
                    </button>

                    <div className="dropdown">

                        <button
                            className="btn btn-link text-decoration-none text-white d-flex align-items-center gap-2 p-0"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <span className="avatar-circle"><i className="bi bi-person-fill"></i></span>
                            <span className="d-none d-md-inline fw-semibold">
                                {user?.nama || user?.nomorKepegawaian || "Pengguna"}
                            </span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <span className="dropdown-item-text small text-secondary">
                                    NIK: {user?.nomorKepegawaian}
                                </span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Keluar
                                </button>
                            </li>
                        </ul>

                    </div>

                </div>

            </div>

        </nav>

    );

}
