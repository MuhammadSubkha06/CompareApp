import { getHistoryDetailController } from "@/controllers/historyController";
import { buildExportFile } from "@/services/exportService";

export async function GET(request, context) {

    try {

        const { id } = await context.params;

        const { searchParams } = new URL(request.url);
        const format = (searchParams.get("format") || "xlsx").toLowerCase();

        if (!["csv", "xlsx"].includes(format)) {
            return Response.json({
                success: false,
                message: "Format export tidak didukung. Gunakan csv atau xlsx."
            }, { status: 400 });
        }

        const detail = await getHistoryDetailController(id);

        if (!detail) {
            return Response.json({
                success: false,
                message: "Data riwayat tidak ditemukan"
            }, { status: 404 });
        }

        const { buffer, contentType, fileName } = buildExportFile(detail, format);

        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${fileName}"`
            }
        });

    }
    catch (error) {

        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 });

    }

}
