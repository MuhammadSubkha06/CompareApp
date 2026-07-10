import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import FileUpload from "../components/compare/FileUpload";
import FilePreview from "../components/compare/FilePreview";
import CompareOption from "../components/compare/CompareOption";
import CompareResult from "../components/compare/CompareResult";

import { uploadFile, runCompare } from "../services/compareService";

export default function Compare() {

    const [fileA, setFileA] = useState(null);
    const [fileB, setFileB] = useState(null);

    const [uploadingA, setUploadingA] = useState(false);
    const [uploadingB, setUploadingB] = useState(false);

    const [primaryKey, setPrimaryKey] = useState("");
    const [comparing, setComparing] = useState(false);
    const [result, setResult] = useState(null);

    async function handleUpload(file, side) {

        const setUploading = side === "A" ? setUploadingA : setUploadingB;
        const setFile = side === "A" ? setFileA : setFileB;

        try {
            setUploading(true);
            setResult(null);

            const response = await uploadFile(file);

            if (!response.success) {
                throw new Error(response.message || "Upload gagal");
            }

            setFile(response.data);
            toast.success(`File ${side} berhasil diunggah`);
        }
        catch (error) {
            toast.error(error.response?.data?.message || error.message || "Gagal mengunggah file");
        }
        finally {
            setUploading(false);
        }
    }

    async function handleCompare() {

        try {
            setComparing(true);

            const response = await runCompare(fileA, fileB, primaryKey);

            if (!response.success) {
                throw new Error(response.message || "Compare gagal");
            }

            setResult(response.data);

            toast.success("Compare berhasil & tersimpan di History");

            Swal.fire({
                icon: "success",
                title: "Compare Selesai",
                html: `Total <b>${response.data.totalRows}</b> baris diperiksa.<br/>
                       Match: <b>${response.data.match}</b>, Berbeda: <b>${response.data.different}</b>`,
                confirmButtonColor: "#198754"
            });
        }
        catch (error) {
            const message = error.response?.data?.message || error.message || "Gagal melakukan compare";
            toast.error(message);
            Swal.fire({ icon: "error", title: "Compare Gagal", text: message });
        }
        finally {
            setComparing(false);
        }
    }

    function handleReset() {
        setFileA(null);
        setFileB(null);
        setPrimaryKey("");
        setResult(null);
    }

    const headers = fileA?.headers || [];

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="page-title mb-1">Compare File</h4>
                    <small className="page-subtitle">Bandingkan CSV dengan Excel, atau CSV dengan CSV</small>
                </div>
                {
                    (fileA || fileB) &&
                    <button className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                        Reset
                    </button>
                }
            </div>

            <div className="alert alert-primary border-0 d-flex align-items-center gap-2 mb-4" role="alert">
                <i className="bi bi-info-circle-fill"></i>
                <small>Unggah kedua file, lalu pilih kolom unik yang digunakan sebagai primary key.</small>
            </div>

            <div className="row g-4">

                <div className="col-lg-6">
                    <FileUpload
                        title="Upload File A"
                        onUpload={(file) => handleUpload(file, "A")}
                        file={fileA}
                        uploading={uploadingA}
                    />
                    <FilePreview data={fileA} />
                </div>

                <div className="col-lg-6">
                    <FileUpload
                        title="Upload File B"
                        onUpload={(file) => handleUpload(file, "B")}
                        file={fileB}
                        uploading={uploadingB}
                    />
                    <FilePreview data={fileB} />
                </div>

            </div>

            <CompareOption
                fileA={fileA}
                fileB={fileB}
                headers={headers}
                primaryKey={primaryKey}
                onPrimaryKeyChange={setPrimaryKey}
            />

            {
                fileA && fileB &&
                <div className="text-center mt-4">
                    <button
                        className="btn btn-success btn-lg px-5"
                        disabled={!primaryKey || comparing}
                        onClick={handleCompare}
                    >
                        {
                            comparing
                                ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Membandingkan...
                                    </>
                                )
                                : (
                                    <>
                                        <i className="bi bi-play-circle me-2"></i>
                                        Compare Sekarang
                                    </>
                                )
                        }
                    </button>
                </div>
            }

            {
                result &&
                <CompareResult
                    result={result}
                    fileNameA={fileA.fileName}
                    fileNameB={fileB.fileName}
                />
            }

        </div>

    );

}
