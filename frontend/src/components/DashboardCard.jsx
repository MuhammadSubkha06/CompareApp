import { Card } from "react-bootstrap";

export default function DashboardCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <Card className={`stat-card shadow-sm border-0 h-100 text-${color}`}>

            <Card.Body>

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <small className="text-muted fw-semibold">
                            {title}
                        </small>

                        <h2 className="fw-bold mt-2 mb-0 text-dark">
                            {value}
                        </h2>

                    </div>

                    <div
                        className={`stat-icon bg-${color}-subtle text-${color} d-flex align-items-center justify-content-center`}
                    >
                        <i className={`bi ${icon} fs-3`}></i>
                    </div>

                </div>

            </Card.Body>

        </Card>

    );

}
