import 'dotenv/config'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schemas",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!
    // host: process.env.POSTGRES_HOST!,
    // user: process.env.POSTGRES_USER!,
    // password: process.env.POSTGRES_PASSWORD!,
    // database:  process.env.POSTGRES_DATABASE!,
    // port: Number(process.env.POSTGRES_PORT)
  },
  verbose: true, // Tell us what's going be changed
  strict: true // When causing certain change to database, there's confirmation, slightly like security
});
