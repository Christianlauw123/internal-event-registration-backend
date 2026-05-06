import { PaginationDto } from "../../helper/pagination_helper.js"
import { CityResponseDto } from "../cities/cities.dto.js"

// company.dto.ts
interface CompanyResponseDto {
    id: string
    name: string
    address: string
    city: CityResponseDto | null
}

interface CreateCompanyDto {
    name: string
    address: string
    year?: number
    cityId: string
}

interface UpdateCompanyDto {
    id: string
    name?: string
    address?: string
    cityId?: string
}

interface DeleteCompanyDto {
    id: string
}

// Filter
interface CompanyFilterDto extends PaginationDto {
    id?: string
    name?: string
    keyword?: string
    cityId?: string
    year?: number
    deleted?: boolean
}

export {
    CompanyResponseDto,
    CreateCompanyDto,
    UpdateCompanyDto,
    DeleteCompanyDto,
    CompanyFilterDto
}