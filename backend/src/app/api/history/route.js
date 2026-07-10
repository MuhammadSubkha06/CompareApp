import { getHistoryListController } from "@/controllers/historyController";

export async function GET() {

    try {

        const data = await getHistoryListController();

        return Response.json({
            success: true,
            data
        });

    }
    catch (error) {

        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500
        });

    }

}
