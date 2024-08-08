import {OpenAPIRoute} from "chanfana";
import {z} from "zod";


export class AddUserData extends OpenAPIRoute {
    schema = {
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            key: z.string(),
                            user_id: z.string().uuid(),
                            username: z.string(),
                            data: z.object({
                                age: z.number().nullable(),
                                location: z.string().nullable()
                            })
                        })
                    }
                }
            }
        }
    }

    async handle(c: any) {
        const data = await this.getValidatedData<typeof this.schema>();

        if (data.body.key !== c.env.USER_DATA_AUTHORISATION_KEY) {
            console.log("Invalid key request:", data.body.key);
            return new Response("Invalid Key", {status: 401})
        }
        const {age, location} = data.body.data;

        console.log(data.body);

        const result = await c.env.DB.prepare(
            "INSERT INTO user_sensitive_data(user_id, username, age, location) VALUES(?, ?, ?, ?)",
        ).bind(data.body.user_id, data.body.username, age, location).run();

        if (!result.success) {
            return new Response(undefined, {status: 500});
        }

        return new Response(JSON.stringify({
            result
        }), {status: 200});
    }
}

