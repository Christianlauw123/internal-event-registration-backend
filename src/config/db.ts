import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg'
import * as schema from '../database/schemas/schema.js';

const pgPool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD || "",
  database:  process.env.POSTGRES_DATABASE || "",
  port: Number(process.env.POSTGRES_PORT),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
})


const db = drizzle({ client: pgPool, schema: schema });

export {
    db
}