import { CompanyResponseDto } from "../company/company.dto.js"
import { ParticipantResponseDto } from "../participant/participant.dto.js"

// company_owner.dto.ts
interface CompanyOwnerResponseDto {
    id: string
    company?: CompanyResponseDto
    owners?: ParticipantResponseDto [] | null
    deletedAt?: Date | null
}

interface CreateCompanyOwnerDto {
    companyId: string
    participantIds: string[]
}

interface DeleteCompanyOwnerDto {
    companyId: string
    participantIds: string[]
}

interface CompanyOwnerFilterDto {
  companyId?: string
  deleted?: boolean
}

export {
    CompanyOwnerResponseDto,
    CreateCompanyOwnerDto,
    CompanyOwnerFilterDto,
    DeleteCompanyOwnerDto
}