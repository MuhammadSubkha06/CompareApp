import { upload } from "@/services/uploadService";

export async function POST(request) {

    try {

        const formData = await request.formData();

        const file = formData.get("file");

        if (!file) {

            return Response.json({

                success:false,

                message:"File kosong"

            },{status:400});

        }

        const result = await upload(file);

        return Response.json({

            success:true,

            data:result

        });

    }

    catch(error){

        return Response.json({

            success:false,

            message:error.message

        },{

            status:500

        });

    }

}