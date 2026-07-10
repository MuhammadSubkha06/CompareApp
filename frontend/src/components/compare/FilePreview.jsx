export default function FilePreview({ data }) {

    if (!data) return null;

    return (

        <div className="card mt-3 shadow-sm border-0">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-truncate">{data.fileName}</h6>
                    <span className="badge bg-secondary text-uppercase">{data.extension}</span>
                </div>

                <p className="text-muted small mb-2">
                    {data.totalRows} baris &middot; {data.headers.length} kolom
                </p>

                <div className="table-responsive" style={{ maxHeight: "260px" }}>
                    <table className="table table-bordered table-sm mb-0">
                        <thead className="table-light">
                            <tr>
                                {data.headers.map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.preview.map((row, index) => (
                                <tr key={index}>
                                    {data.headers.map(h => (
                                        <td key={h}>{row[h]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-muted small mt-2 mb-0">
                    Menampilkan {data.preview.length} dari {data.totalRows} baris (preview)
                </p>

            </div>

        </div>

    );

}
