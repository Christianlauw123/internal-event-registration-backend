import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { Timestamps } from './helper/timestamps.js';

const UserTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 256 }),
  role: varchar({ length: 256 }),
  email: text().unique().notNull(),
  password: text().notNull(),
  ...Timestamps
});

export{
  UserTable
}