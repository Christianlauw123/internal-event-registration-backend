// Talk to Database
import { and, eq, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { CreateShioDto, ShioFilterDto } from './shios.dto.js';
import { ShioTable } from '../../database/schemas/shios.js';

class ShioRepository{
    async findAllShios(filters: ShioFilterDto | null){
        const orConditions = [];
        const andConditions = [];
        
        filters?.id && orConditions.push(eq(ShioTable.id, filters.id));
        if(filters?.keyword){
            orConditions.push(ilike(ShioTable.indonesianShio, `%${filters.keyword}%`));
            orConditions.push(ilike(ShioTable.mandarinShio, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }
        
        // By default, only return non-deleted shios. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(ShioTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(ShioTable.deletedAt)) : andConditions.push(isNull(ShioTable.deletedAt)))

        return await db.select().from(ShioTable).where(and(...andConditions)).orderBy(ShioTable.indonesianShio);
    }

    async createShio(req: CreateShioDto){
        return await db.insert(ShioTable).values(req).returning();
    }

    async updateShio(id: string, req: Partial<typeof ShioTable.$inferInsert>){
        return await db.update(ShioTable).set(withUpdatedAt(req)).where(eq(ShioTable.id, id)).returning();
    }

    async deleteShio(id: string, req: Partial<typeof ShioTable.$inferInsert>){
        return await db.update(ShioTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(ShioTable.id, id)).returning();
    }
}

export {
    ShioRepository
}