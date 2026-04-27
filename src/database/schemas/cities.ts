import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';

const CityTable = pgTable('cities', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text(),
  ...Timestamps,
});

export {
  CityTable
}