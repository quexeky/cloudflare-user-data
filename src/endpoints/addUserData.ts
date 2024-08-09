import {OpenAPIRoute} from "chanfana";
import {z} from "zod";


export class AddUserData extends OpenAPIRoute {
    schema = {
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            key: z.string().base64().length(88),
                            user_id: z.string().uuid(),
                            data: z.object({
                                age: z.number(),
                                location: z.string()
                            })
                        })
                    }
                }
            }
        }
    }

    async handle(c: any) {
        const data = await this.getValidatedData<typeof this.schema>();

        if (data.body.key !== c.env.USER_DATA_AUTH_KEY) {
            console.log("Invalid key request:", data.body.key);
            return new Response("Invalid Key", {status: 401})
        }
        const {age, location} = data.body.data;

        console.log(data.body);

        const result = await c.env.DB.prepare(
            "INSERT INTO user_sensitive_data(user_id, age, location) VALUES(?, ?, ?)",
        ).bind(data.body.user_id, age, location).run();

        if (!result.success) {
            return new Response(undefined, {status: 500});
        }

        return new Response(JSON.stringify({
            result
        }), {status: 200});
    }
}

