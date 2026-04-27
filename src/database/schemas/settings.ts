import { pgTable, text, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';

const SettingTable = pgTable('settings', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  year: integer('year'),
  title: text('title'),
  isActive: boolean('is_active').default(true),
  ...Timestamps,
});

export {
  SettingTable
}