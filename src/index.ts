import { Hono } from 'hono'
import {fromHono} from "chanfana";
import {AddUserData} from "./endpoints/addUserData";
import {GetUserData} from "./endpoints/getUserData";

// Start a Hono app
const app = new Hono<{Bindings: Env}>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/userData", AddUserData);
openapi.post("/api/getUserData", GetUserData);

// Export the Hono app
export default app;
