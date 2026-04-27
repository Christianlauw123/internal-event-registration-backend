// participant.repository.ts
import { and, eq, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { ParticipantTable } from '../../database/schemas/participants.js';
import { CreateParticipantDto, ParticipantFilterDto } from './participant.dto.js';
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { ShioTable } from '../../database/schemas/shios.js';

class ParticipantRepository{
    async findAllParticipants(filters: ParticipantFilterDto | null){
        const orConditions = [];
        const andConditions = [];

        filters?.id && orConditions.push(eq(ParticipantTable.id, filters.id));
        filters?.name && orConditions.push(eq(ParticipantTable.name, filters.name.trim().toLowerCase()));
        
        if(filters?.keyword){
            orConditions.push(ilike(ParticipantTable.name, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        filters?.isMandarin && andConditions.push(eq(ParticipantTable.isMandarin, filters.isMandarin));
        filters?.shioId && andConditions.push(eq(ParticipantTable.shioId, filters.shioId));

        // By default, only return non-deleted participants. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(ParticipantTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(ParticipantTable.deletedAt)) : andConditions.push(isNull(ParticipantTable.deletedAt)))

        return await db.select({
          id: ParticipantTable.id,
          name: ParticipantTable.name,
          isMandarin: ParticipantTable.isMandarin,
          shioId: ShioTable.id,
          indonesianShio: ShioTable.indonesianShio,
          mandarinShio: ShioTable.mandarinShio,
        }).from(ParticipantTable).leftJoin(ShioTable, eq(ParticipantTable.shioId, ShioTable.id)).where(and(...andConditions)).orderBy(ParticipantTable.name);
    }

    async createParticipant(req: CreateParticipantDto){
        return await db.insert(ParticipantTable).values(req).returning();
    }

    async updateParticipant(id: string, req: Partial<typeof ParticipantTable.$inferInsert>){
        return await db.update(ParticipantTable).set(withUpdatedAt(req)).where(eq(ParticipantTable.id, id)).returning();
    }

    async deleteParticipant(id: string, req: Partial<typeof ParticipantTable.$inferInsert>){
        return await db.update(ParticipantTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(ParticipantTable.id, id)).returning();
    }
}

export {
    ParticipantRepository
}