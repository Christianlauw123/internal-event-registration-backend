// Shio.dto.ts
interface ShioResponseDto {
    id: string
    indonesianShio: string | null
    mandarinShio: string | null
    deletedAt?: Date | null
}

interface CreateShioDto {
    indonesianShio: string
    mandarinShio: string
}

interface UpdateShioDto {
    id: string
    indonesianShio?: string
    mandarinShio?: string
}

interface DeleteShioDto {
    id: string
}

// Filter
interface ShioFilterDto {
    id?: string
    keyword?: string
    deleted?: boolean
}

export {
    ShioResponseDto,
    CreateShioDto,
    UpdateShioDto,
    DeleteShioDto,
    ShioFilterDto
}