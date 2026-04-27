import { pgTable, text, uuid, boolean, integer } from 'drizzle-orm/pg-core';
import { Timestamps } from './helper/timestamps.js';
import { CompanyTable } from './companies.js';
import { ParticipantTable } from './participants.js';

const TransactionTable = pgTable('transactions', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  sequence: integer('sequence'),
  isMandarin: boolean('is_mandarin'),
  transactionType: text('transaction_type'),
  year: integer('year'),
  participantId: uuid('participant_id').references(() => ParticipantTable.id),
  companyId: uuid('company_id').references(() => CompanyTable.id),
  applicantId: uuid('applicant_id').references(() => ParticipantTable.id),
  ...Timestamps,
});

export {
  TransactionTable
}