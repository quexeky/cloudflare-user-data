# Cloudflare User Data Service
A starter project for creating and authenticating users using bcrypt, usernames, and user IDs

# Setup
This setup assumes a pre-configured wrangler CLI, although includes the package itself within the dependencies. For more details, see
[Cloudflare Docs](https://developers.cloudflare.com/workers/wrangler/install-and-update/) \
```git clone https://github.com/quexeky/cloudflare-user-data.git``` \
```cd cloudflare-user-data``` \
```npm i``` \
```npx wrangler d1 create user-data``` \
```npx wrangler d1 execute user-data --command "CREATE TABLE user_data(user_id TEXT PRIMARY KEY NOT NULL, age NUMBER, location TEXT)" ``` \
Take note of the "database_id" value provided and replace <DATABASE_ID> with that value
```toml
# wrangler.toml

# ...

[[d1_databases]]
binding = "DB" 
database_name = "user-data"
database_id = "<PASTE DATABASE_ID HERE>"

# ...
```
## Secrets
For the following commands, you will be prompted to provide a secret value, which must be 512 bits long and encoded as
88 base64 characters. This value should be securely random, such as through this python script:
```python
import os
import base65
s = bytearray(os.urandom(64))
print(base64.b64encode(s))
```
Take note of the "USER_DATA_AUTH_KEY" for quexeky-auth and cloudflare-user-db setup. \
```npx wrangler secrets put USER_DATA_AUTH_KEY``` \

This value may also be put into the `.dev.vars` file for local deployment by replacing <USER_DATA_AUTH_KEY> with the same generated value:
```dotenv
# .dev.vars
USER_DATA_AUTH_KEY="<USER_DATA_AUTH_KEY>
```
# Deploy
```npx wrangler deploy```