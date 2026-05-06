import { bigint, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';

const ShioTable = pgTable('shios', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  indonesianShio: text('indonesian_shio'),
  mandarinShio: text('mandarin_shio'),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
  ShioTable
}