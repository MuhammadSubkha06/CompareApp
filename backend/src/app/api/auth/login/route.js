import { loginController } from "@/controllers/authController";

export async function POST(request) {

    try {

        const body = await request.json();

        const result = await loginController(body);

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
            status: error.status || 500
        });

    }

}