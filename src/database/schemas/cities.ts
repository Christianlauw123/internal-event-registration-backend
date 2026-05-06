import { bigint, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';

const CityTable = pgTable('cities', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text(),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
  CityTable
}