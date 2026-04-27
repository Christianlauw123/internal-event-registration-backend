// Talk to Database
import { and, eq, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { db } from '../../config/db.js'
import { UserTable } from '../../database/schemas/users.js'
import { withDeletedAt, withUpdatedAt } from '../../helper/model_helper.js';
import { CreateUserDto, UserFilterDto } from './users.dto.js';

class UserRepository{
    async findAllUsers(filters: UserFilterDto | null){
        const orConditions = [];

        const andConditions = [];

        // id priority
        filters?.id && orConditions.push(eq(UserTable.id, filters.id));
        filters?.email && orConditions.push(eq(UserTable.email, filters.email));
        if(filters?.keyword){
            orConditions.push(ilike(UserTable.name, `%${filters.keyword}%`));
            orConditions.push(ilike(UserTable.email, `%${filters.keyword}%`));
        }

        if (orConditions.length > 0) {
            andConditions.push(or(...orConditions));
        }

        filters?.role && andConditions.push(eq(UserTable.role, filters.role));

        // By default, only return non-deleted users. If deleted filter is provided, override the default behavior
        filters?.deleted !== undefined ? andConditions.push(isNull(UserTable.deletedAt)) : (filters?.deleted ? andConditions.push(isNotNull(UserTable.deletedAt)) : andConditions.push(isNull(UserTable.deletedAt)))

        return await db.select().from(UserTable).where(and(...andConditions)).orderBy(UserTable.email);
    }

    async createUser(req: CreateUserDto){
        return await db.insert(UserTable).values(req).returning();
    }

    async updateUser(id: string, req: Partial<typeof UserTable.$inferInsert>){
        return await db.update(UserTable).set(withUpdatedAt(req)).where(eq(UserTable.id, id)).returning();
    }

    async deleteUser(id: string, req: Partial<typeof UserTable.$inferInsert>){
        return await db.update(UserTable).set(withDeletedAt(withUpdatedAt(req))).where(eq(UserTable.id, id)).returning();
    }
}

export {
    UserRepository
}