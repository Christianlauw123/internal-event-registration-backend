import { PaginationDto } from "../../helper/pagination_helper.js"
import { ShioResponseDto } from "../shios/shios.dto.js"

// participant.dto.ts
interface ParticipantResponseDto {
    id: string
    name: string | null
    isMandarin: boolean
    shio: ShioResponseDto | null
}

interface CreateParticipantDto {
    name: string
    isMandarin: boolean
    year: number
    shioId: string
}

interface UpdateParticipantDto {
    id: string
    name?: string
    isMandarin?: boolean
    shioId?: string
}

interface DeleteParticipantDto {
    id: string
}

// Filter
interface ParticipantFilterDto extends PaginationDto {
    id?: string
    name?: string
    keyword?: string
    isMandarin?: boolean
    shioId?: string
    deleted?: boolean
    year?: number
}

export {
    ParticipantResponseDto,
    CreateParticipantDto,
    UpdateParticipantDto,
    DeleteParticipantDto,
    ParticipantFilterDto
}