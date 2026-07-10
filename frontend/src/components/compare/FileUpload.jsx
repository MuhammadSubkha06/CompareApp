import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ title, onUpload, file, uploading }) {

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.[0]) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            "text/csv": [".csv"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
        }
    });

    return (

        <div
            {...getRootProps()}
            className={`upload-dropzone p-4 text-center ${isDragActive ? "is-dragging" : ""}`}
        >

            <input {...getInputProps()} />

            {
                uploading
                    ? (
                        <>
                            <div className="spinner-border text-primary mb-2" role="status"></div>
                            <p className="mb-0 small text-muted">Mengunggah & membaca file...</p>
                        </>
                    )
                    : (
                        <>
                            <i className={`bi ${file ? "bi-check-circle-fill text-success" : "bi-cloud-upload text-primary"} fs-1`}></i>
                            <h6 className="mt-3 mb-1">{title}</h6>
                            {
                                file
                                    ? <p className="mb-0 small text-truncate">{file.fileName}</p>
                                    : <p className="mb-0 small text-muted">Klik atau seret file CSV / Excel ke sini</p>
                            }
                        </>
                    )
            }

        </div>

    );

}
