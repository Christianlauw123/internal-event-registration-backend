// company_owner.repository.ts
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { CompanyOwnerFilterDto, CreateCompanyOwnerDto } from './company_owner.dto.js';
import { CompanyOwnerTable } from '../../database/schemas/company_owners.js';
import { ParticipantTable } from '../../database/schemas/participants.js';
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { CityTable } from '../../database/schemas/cities.js';

class CompanyOwnerRepository{
    async findAllCompanyOwners(filters: CompanyOwnerFilterDto | null){
        const orConditions = [];
        const andConditions = [];
        
        filters?.companyId && orConditions.push(eq(CompanyOwnerTable.companyId, filters.companyId));

        // By default, only return non-deleted cities. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(CompanyOwnerTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(CompanyOwnerTable.deletedAt)) : andConditions.push(isNull(CompanyOwnerTable.deletedAt)))

        return await db.select({
          id: CompanyOwnerTable.id,
          participantId: ParticipantTable.id,
          participantName: ParticipantTable.name,
        }).from(CompanyOwnerTable).leftJoin(ParticipantTable, eq(CompanyOwnerTable.participantId, ParticipantTable.id)).where(and(...andConditions)).orderBy(CompanyOwnerTable.createdAt);
    }

    async createCompanyOwner(req: CreateCompanyOwnerDto){
      // Since this is a many-to-many relationship, we need to insert multiple records for each participantId
      let values: { companyId: string; participantId: string }[] = [];
      req.participantIds.forEach(participantId => {
          values.push({
              companyId: req.companyId,
              participantId: participantId
          })
      })
      return await db.insert(CompanyOwnerTable).values(values).returning();
    }

    async deleteCompanyOwner(id: string, req: Partial<typeof CompanyOwnerTable.$inferInsert>){
        return await db.update(CompanyOwnerTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(CompanyOwnerTable.id, id)).returning();
    }
}

export {
    CompanyOwnerRepository
}