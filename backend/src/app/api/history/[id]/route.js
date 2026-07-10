import { getHistoryDetailController } from "@/controllers/historyController";

export async function GET(request, context) {

    try {

        const { id } = await context.params;

        const data = await getHistoryDetailController(id);

        if (!data) {
            return Response.json({
                success: false,
                message: "Data riwayat tidak ditemukan"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            data
        });

    }
    catch (error) {

        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 });

    }

}
