interface UserResponseDto {
    id: string
    name: string | null
    role: string | null
    email: string
    deletedAt?: Date | null
}

interface CreateUserDto {
    name: string
    role: string
    email: string
    password: string
    password_confirmation: string
}

interface UpdateUserDto {
    id: string
    name?: string
    email?: string
    role?: string
    password?: string
    password_confirmation?: string
}

interface DeleteUserDto {
    id: string
}

// Filter
interface UserFilterDto {
    id?: string
    name?: string
    role?: string
    email?: string
    keyword?: string
    deleted?: boolean
}

export {
    UserResponseDto,
    CreateUserDto,
    UpdateUserDto,
    DeleteUserDto,
    UserFilterDto
}