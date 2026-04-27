// company.repository.ts
// Talk to Database
import { and, eq, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { CompanyFilterDto, CreateCompanyDto } from './company.dto.js';
import { CityTable } from '../../database/schemas/cities.js';
import { CompanyTable } from '../../database/schemas/companies.js';
import { CreateCityDto } from '../cities/cities.dto.js';

class CompanyRepository{
    async findAllCompanies(filters: CompanyFilterDto | null){
        const orConditions = [];
        const andConditions = [];
        
        filters?.id && orConditions.push(eq(CompanyTable.id, filters.id));
        filters?.cityId && orConditions.push(eq(CompanyTable.cityId, filters.cityId));
        filters?.name && orConditions.push(eq(CompanyTable.name, filters.name.trim().toLowerCase()));

        if(filters?.keyword){
            orConditions.push(ilike(CompanyTable.name, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        // By default, only return non-deleted cities. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(CompanyTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(CompanyTable.deletedAt)) : andConditions.push(isNull(CityTable.deletedAt)))

        return await db.select({
          id: CompanyTable.id,
          name: CompanyTable.name,
          address: CompanyTable.address,
          cityId: CityTable.id,
          cityName: CityTable.name
        }).from(CompanyTable).leftJoin(CityTable,eq(CompanyTable.cityId,CityTable.id)).where(and(...andConditions)).orderBy(CityTable.name);
    }

    async createCompany(req: CreateCompanyDto){
        return await db.insert(CompanyTable).values(req).returning();
    }

    async updateCompany(id: string, req: Partial<typeof CompanyTable.$inferInsert>){
        return await db.update(CompanyTable).set(withUpdatedAt(req)).where(eq(CompanyTable.id, id)).returning();
    }

    async deleteCompany(id: string, req: Partial<typeof CompanyTable.$inferInsert>){
        return await db.update(CompanyTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(CompanyTable.id, id)).returning();
    }
}

export {
    CompanyRepository
}