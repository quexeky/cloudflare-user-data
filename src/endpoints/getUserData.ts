import { OpenAPIRoute } from "chanfana";
import {z} from "zod";


export class GetUserData extends OpenAPIRoute {
    schema = {
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            key: z.string(),
                            user_id: z.string().uuid(),
                            column: z.string(),
                        })
                    }
                }
            }
        }
    }
    async handle(c: any) {
        const data = await this.getValidatedData<typeof this.schema>();

        if (data.body.key !== c.env.USER_DATA_AUTHORISATION_KEY) {
            return new Response(undefined, { status: 401 })
        }

        const result = await c.env.DB.prepare(
            "SELECT * FROM user_sensitive_data WHERE user_id = ?",
        ).bind(data.body.user_id).run();

        if (!result.success) {
            return new Response(JSON.stringify({success: false}), { status: 500 });
        }

        const requested_data = result.results[0][data.body.column];

        if (requested_data !== undefined)

            return new Response(JSON.stringify(
                {
                    requested_data
                }),
                { status: 200 });
        return new Response(undefined, { status: 404 })
    }
}

