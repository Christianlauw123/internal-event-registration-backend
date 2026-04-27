// Talk to Database
import { and, eq, ilike, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { CreateCityDto, CityFilterDto } from './cities.dto.js';
import { CityTable } from '../../database/schemas/cities.js';

class CityRepository{
    async findAllCities(filters: CityFilterDto | null){
        const orConditions = [];
        const andConditions = [];
        
        filters?.id && orConditions.push(eq(CityTable.id, filters.id));
        filters?.name && orConditions.push(eq(CityTable.name, filters.name.trim().toLowerCase()));

        if(filters?.keyword){
            orConditions.push(ilike(CityTable.name, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        // By default, only return non-deleted cities. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(CityTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(CityTable.deletedAt)) : andConditions.push(isNull(CityTable.deletedAt)))

        return await db.select().from(CityTable).where(and(...andConditions)).orderBy(CityTable.name);
    }

    async createCity(req: CreateCityDto){
        return await db.insert(CityTable).values(req).returning();
    }

    async updateCity(id: string, req: Partial<typeof CityTable.$inferInsert>){
        return await db.update(CityTable).set(withUpdatedAt(req)).where(eq(CityTable.id, id)).returning();
    }

    async deleteCity(id: string, req: Partial<typeof CityTable.$inferInsert>){
        return await db.update(CityTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(CityTable.id, id)).returning();
    }
}

export {
    CityRepository
}