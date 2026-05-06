import { pgTable, text, uuid, integer, boolean, bigint } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';

const SettingTable = pgTable('settings', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  year: integer('year'),
  title: text('title'),
  isActive: boolean('is_active').default(true),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
  SettingTable
}