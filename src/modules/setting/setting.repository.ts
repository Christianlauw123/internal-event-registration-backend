// setting.repository.ts
// Talk to Database
import { and, eq, ilike, isNotNull, isNull, ne, or } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/database_helper.js';
import { CreateSettingDto, SettingFilterDto } from './setting.dto.js';
import { SettingTable } from '../../database/schemas/settings.js';

class SettingRepository{
    async findAllSettings(filters: SettingFilterDto | null){
        const orConditions = [];
        const andConditions = [];

        filters?.id && andConditions.push(eq(SettingTable.id, filters.id));
        filters?.year && orConditions.push(eq(SettingTable.year, filters.year));

        if(filters?.keyword){
            orConditions.push(ilike(SettingTable.title, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        // By default, only return non-deleted settings. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(SettingTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(SettingTable.deletedAt)) : andConditions.push(isNull(SettingTable.deletedAt)))

        return await db.select().from(SettingTable).where(and(...andConditions)).orderBy(SettingTable.year).limit(filters?.limit as number).offset(filters?.offset as number);
    }

    async createSetting(req: CreateSettingDto){
        return await db.insert(SettingTable).values(req).returning();
    }

    async updateSetting(id: string, req: Partial<typeof SettingTable.$inferInsert>){
        return await db.update(SettingTable).set(withUpdatedAt(req)).where(eq(SettingTable.id, id)).returning();
    }

    async deleteSetting(id: string, req: Partial<typeof SettingTable.$inferInsert>){
        return await db.update(SettingTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(SettingTable.id, id)).returning();
    }

    // Util
    async settingActivation(activeSettingId: string){
        // Goal: deactivate all other settings
        return await db.update(SettingTable).set({ isActive: false }).where(ne(SettingTable.id, activeSettingId)).returning();
    }

    async findActiveSetting(){
        return await db.select().from(SettingTable).where(and(eq(SettingTable.isActive, true), isNull(SettingTable.deletedAt))).orderBy(SettingTable.year).limit(1);
    }
}

export {
    SettingRepository
}