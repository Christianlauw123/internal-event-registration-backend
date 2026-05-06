// company_owner.repository.ts
import { and, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { CompanyOwnerFilterDto, CreateCompanyOwnerDto } from './company_owner.dto.js';
import { CompanyOwnerTable } from '../../database/schemas/company_owners.js';
import { ParticipantTable } from '../../database/schemas/participants.js';
import { withDeletedAt, withUpdatedAt } from '../../helper/database_helper.js';
import { CityTable } from '../../database/schemas/cities.js';
import { CompanyTable } from '../../database/schemas/companies.js';
import { activeYearFilter } from '../../helper/model_helper.js';

class CompanyOwnerRepository{
    async findAllCompanyOwners(filters: CompanyOwnerFilterDto | null){
        const orConditions = [];
        const andConditions = [];
        
        filters?.companyId && orConditions.push(eq(CompanyOwnerTable.companyId, filters.companyId));

        // By default, only return non-deleted cities. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(CompanyOwnerTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(CompanyOwnerTable.deletedAt)) : andConditions.push(isNull(CompanyOwnerTable.deletedAt)))
        
        filters?.year && andConditions.push(eq(CompanyOwnerTable.year, filters.year));

        return await db.select({
          id: CompanyOwnerTable.id,
          participantId: ParticipantTable.id,
          participantName: ParticipantTable.name,
          companyId: CompanyTable.id,
          companyName: CompanyTable.name,
          companyAddress: CompanyTable.address
        }).from(CompanyOwnerTable).leftJoin(ParticipantTable, eq(CompanyOwnerTable.participantId, ParticipantTable.id)).leftJoin(CompanyTable, eq(CompanyOwnerTable.companyId, CompanyTable.id)).where(and(...andConditions)).orderBy(CompanyOwnerTable.createdAt).limit(filters?.limit as number).offset(filters?.offset as number);
    }

    async createCompanyOwner(req: CreateCompanyOwnerDto){
      // Since this is a many-to-many relationship, we need to insert multiple records for each participantId
      let values: { companyId: string; participantId: string; year: number }[] = [];
      const activeYear = await activeYearFilter();
      req.participantIds.forEach(participantId => {
          values.push({
              companyId: req.companyId,
              participantId: participantId,
              year: activeYear?.year as number
          })
      })

      return await db.insert(CompanyOwnerTable).values(values).returning();
    }

    async deleteCompanyOwner(companyId: string, participantIds: string[]){
        const andConditions = await this.setConditional(companyId, participantIds);
        return await db.update(CompanyOwnerTable).set(withDeletedAt(withUpdatedAt({}))).where(and(...andConditions)).returning();
    }

    // Util
    async findExistingCompanyOwner(companyId: string, participantIds: string[]){
        const andConditions = await this.setConditional(companyId, participantIds);
        return await db.select({
            participantName: ParticipantTable.name,
            participantId: ParticipantTable.id
        }).from(CompanyOwnerTable).leftJoin(ParticipantTable, eq(CompanyOwnerTable.participantId, ParticipantTable.id)).where(and(...andConditions));
    }

    // Specific filter
    private async setConditional(companyId: string, participantIds: string[]) {
        const andConditions = [];
        const activeYear = await activeYearFilter();

        andConditions.push(eq(CompanyOwnerTable.companyId, companyId));
        andConditions.push(eq(CompanyOwnerTable.year, activeYear?.year as number));
        andConditions.push(inArray(CompanyOwnerTable.participantId, participantIds));
        return andConditions;
    }
}

export {
    CompanyOwnerRepository
}
