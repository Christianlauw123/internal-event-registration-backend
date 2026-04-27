// setting.dto.ts
interface SettingResponseDto {
    id: string
    year: number | null
    title: string | null
    deletedAt?: Date | null
}

interface CreateSettingDto {
    year: number
    title: string
}

interface UpdateSettingDto {
    id: string
    year?: number
    title?: string
}

interface DeleteSettingDto {
    id: string
}

// Filter
interface SettingFilterDto {
    id?: string
    year?: number
    keyword?: string
    deleted?: boolean
}

export {
    SettingResponseDto,
    CreateSettingDto,
    UpdateSettingDto,
    DeleteSettingDto,
    SettingFilterDto
}