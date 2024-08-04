import { OpenAPIRoute } from "chanfana";
import {z} from "zod";


export class AddUserData extends OpenAPIRoute {
    schema = {
        request: {
            query: z.object({
                key: z.string().regex(/^(?:[\w-]*\.){2}[\w-]*$/),
                user_id: z.string().uuid(),
                data: z.object({
                    age: z.number().nullable(),
                    location: z.string().nullable()
                })
            })
        }
    }
    async handle(c: any) {
        const data = await this.getValidatedData<typeof this.schema>();

        if (data.query.key !== c.env.USER_DATA_AUTHORISATION_KEY) {
            return new Response(undefined, { status: 401 })
        }
        const { age, location } = data.query.data;

        const result = await c.env.DB.prepare(
            "INSERT INTO user_sensitive_data(user_id, age, location) VALUES(?, ?, ?)",
        ).bind(data.query.user_id, age, location).run();

        if (!result.success) {
            return new Response(undefined, { status: 500 });
        }


        return new Response(JSON.stringify({
            result
        }), { status: 200 });
    }
}

