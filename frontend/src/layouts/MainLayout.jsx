import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {

    return (

        <div className="d-flex min-vh-100">

            <Sidebar />
            <Sidebar mobile />

            <div className="flex-grow-1 main-content">

                <Navbar />

                <div className="container-fluid p-4 page-container">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}
