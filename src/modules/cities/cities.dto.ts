// city.dto.ts
interface CityResponseDto {
    id: string
    name: string | null
    deletedAt?: Date | null
}

interface CreateCityDto {
    name: string
}

interface UpdateCityDto {
    id: string
    name?: string
}

interface DeleteCityDto {
    id: string
}

// Filter
interface CityFilterDto {
    id?: string
    keyword?: string
    name?: string
    deleted?: boolean
}

export {
    CityResponseDto,
    CreateCityDto,
    UpdateCityDto,
    DeleteCityDto,
    CityFilterDto
}