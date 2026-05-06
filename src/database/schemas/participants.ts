import { pgTable, text, uuid, boolean, integer, bigint } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';
import { ShioTable } from './shios.js';

const ParticipantTable = pgTable('participants', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text('name'),
  isMandarin: boolean('is_mandarin'),
  year: integer('year'),
  shioId: uuid('shio_id').references(() => ShioTable.id),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
  ParticipantTable
}