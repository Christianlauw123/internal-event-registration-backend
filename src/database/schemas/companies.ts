import { bigint, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';
import { CityTable } from './cities.js';

const CompanyTable = pgTable('companies', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text('name'),
  year: integer('year'),
  address: text('address'),
  cityId: uuid('city_id').references(() => CityTable.id),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
  CompanyTable
}