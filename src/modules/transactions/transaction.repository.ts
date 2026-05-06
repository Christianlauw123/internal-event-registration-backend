// setting.repository.ts
// Talk to Database
import { and, eq, ilike, inArray, isNotNull, isNull, ne, or } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/database_helper.js';
import { CreateTransactionDto, TransactionFilterDto } from './transaction.dto.js';
import { SettingTable } from '../../database/schemas/settings.js';
import { TransactionTable } from '../../database/schemas/transactions.js';

class TransactionRepository{
    async findAllTransactions(filters: TransactionFilterDto | null){
        const orConditions = [];
        const andConditions = [];

        filters?.id && andConditions.push(eq(TransactionTable.id, filters.id));
        filters?.year && orConditions.push(eq(TransactionTable.year, filters.year));

        filters?.participantIds && orConditions.push(inArray(TransactionTable.participantId, filters.participantIds));
        filters?.companyIds && orConditions.push(inArray(TransactionTable.companyId, filters.companyIds));

        if(filters?.keyword){
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        // By default, only return non-deleted transactions. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(TransactionTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(TransactionTable.deletedAt)) : andConditions.push(isNull(TransactionTable.deletedAt)))

        const query = db.select().from(TransactionTable).where(and(...andConditions)).orderBy(TransactionTable.year);
        const shouldPaginate = filters?.participantIds || filters?.companyIds

        return await (shouldPaginate ? query.limit(filters?.limit as number).offset(filters?.offset as number) : query);
    }

    async createTransaction(req: CreateTransactionDto[]){
        return await db.insert(TransactionTable).values(req).returning();
    }

    async updateTransaction(id: string, req: Partial<typeof TransactionTable.$inferInsert>){
        return await db.update(TransactionTable).set(withUpdatedAt(req)).where(eq(TransactionTable.id, id)).returning();
    }

    async deleteTransaction(id: string, req: Partial<typeof TransactionTable.$inferInsert>){
        return await db.update(TransactionTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(TransactionTable.id, id)).returning();
    }
}

export {
    TransactionRepository
}