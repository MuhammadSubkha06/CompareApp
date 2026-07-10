import { NavLink } from "react-router-dom";

const menu = [
    { to: "/", label: "Dashboard", icon: "bi-speedometer2", end: true },
    { to: "/compare", label: "Compare", icon: "bi-files" },
    { to: "/history", label: "History", icon: "bi-clock-history" }
];

export default function Sidebar({ mobile = false }) {

    return (

        <aside className={mobile ? "offcanvas offcanvas-start app-sidebar text-white" : "app-sidebar text-white p-3 d-none d-lg-flex flex-column sticky-top vh-100"} id={mobile ? "mobileSidebar" : undefined} tabIndex={mobile ? -1 : undefined}>
            {mobile && <div className="offcanvas-header"><Brand /><button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" /></div>}
            <div className={mobile ? "offcanvas-body d-flex flex-column pt-0" : "d-flex flex-column h-100"}>
            {!mobile && <Brand />}
            <div className="sidebar-label text-uppercase mt-4 mb-2">Menu Utama</div>

            <ul className="nav nav-pills flex-column gap-1">

                {menu.map(item => (
                    <li className="nav-item" key={item.to}>
                        <NavLink
                            className={({ isActive }) =>
                                `nav-link text-white d-flex align-items-center gap-2 ${isActive ? "active bg-primary" : "sidebar-link"}`
                            }
                            to={item.to}
                            end={item.end}
                            data-bs-dismiss={mobile ? "offcanvas" : undefined}
                        >
                            <i className={`bi ${item.icon}`}></i>
                            {item.label}
                        </NavLink>
                    </li>
                ))}

            </ul>

            <div className="mt-auto small text-white-50 pt-3 border-top border-secondary">
                <i className="bi bi-shield-check me-1"></i> Compare File Tool v1.0
            </div>
            </div>
        </aside>

    );

}

function Brand() {
    return <div className="d-flex align-items-center gap-2">
        <span className="brand-mark"><i className="bi bi-file-earmark-diff fs-5"></i></span>
        <div><div className="fw-bold fs-5 lh-1">CompareApp</div><small className="text-white-50">Denso File Tools</small></div>
    </div>;
}
