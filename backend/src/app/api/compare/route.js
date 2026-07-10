import { compareFiles } from "@/controllers/compareController";

export async function POST(request) {

    try {

        const body = await request.json();

        const result = await compareFiles(body);

        return Response.json({
            success: true,
            data: result
        });

    }
    catch (error) {

        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 400
        });

    }

}
