import { timestamp } from 'drizzle-orm/pg-core'

const Timestamps = {
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    deletedAt: timestamp()
}

export {
    Timestamps
}