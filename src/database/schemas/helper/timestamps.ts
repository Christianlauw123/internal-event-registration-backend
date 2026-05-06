import { timestamp } from 'drizzle-orm/pg-core'

const Timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at')
}

export {
    Timestamps
}