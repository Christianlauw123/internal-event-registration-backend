import { pgTable, text, uuid, boolean, integer } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';
import { ShioTable } from './shios.js';

const ParticipantTable = pgTable('participants', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text('name'),
  isMandarin: boolean('is_mandarin'),
  year: integer('year'),
  shioId: uuid('shio_id').references(() => ShioTable.id),
  ...Timestamps,
});

export {
  ParticipantTable
}