import { getDashboard } from "@/controllers/dashboardController";

export async function GET() {

    try {

        const data = await getDashboard();

        return Response.json({
            TotalCompare: data.TotalCompare || 0,
            TotalRows: data.TotalRows || 0,
            MatchRows: data.MatchRows || 0,
            DifferentRows: data.DifferentRows || 0
        });

    }
    catch (error) {

        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 });

    }

}
