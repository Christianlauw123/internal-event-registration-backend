import { PaginationDto } from "../../helper/pagination_helper.js"
import { CompanyResponseDto } from "../company/company.dto.js"
import { ParticipantResponseDto } from "../participant/participant.dto.js"

// company_owner.dto.ts
interface CompanyOwnerResponseDto {
    company?: CompanyResponseDto
    owners?: ParticipantResponseDto [] | null
    deletedAt?: Date | null
}

interface CreateCompanyOwnerDto {
    companyId: string
    participantIds: string[]
    year: number
}

interface DeleteCompanyOwnerDto {
    companyId: string
    participantIds: string[]
}

interface CompanyOwnerFilterDto extends PaginationDto {
    companyId?: string
    deleted?: boolean
    year?: number
}

export {
    CompanyOwnerResponseDto,
    CreateCompanyOwnerDto,
    CompanyOwnerFilterDto,
    DeleteCompanyOwnerDto
}