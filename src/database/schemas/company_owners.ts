import { pgTable, uuid, integer, bigint } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';
import { CompanyTable } from './companies.js';
import { ParticipantTable } from './participants.js';

const CompanyOwnerTable = pgTable('company_owners', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  year: integer('year'),
  companyId: uuid('company_id').references(() => CompanyTable.id),
  participantId: uuid('participant_id').references(() => ParticipantTable.id),
  old_id: bigint({ mode: 'number' }),
  ...Timestamps,
});

export {
    CompanyOwnerTable
}