import { PaginationDto } from "../../helper/pagination_helper.js"

// transaction.dto.ts
enum TransactionType {
  PERORANGAN = 'PERORANGAN',
  PERUSAHAAN = 'PERUSAHAAN'
}

interface TransactionResponseDto {
    id: string
    sequence: number | null
    isMandarin: boolean | null
    transactionType: TransactionType | null
    year: number | null
    participantId: string | null
    companyId: string | null
    applicantId: string | null
    deletedAt?: Date | null
}

interface CreateTransactionRequestDto {
    applicantId: string
    participantIds: string[]
    companyIds: string[],
    year: number
}

interface CreateTransactionDto {
    applicantId: string
    participantId?: string
    companyId?: string
    transactionType: TransactionType | null,
    year: number
}


interface UpdateTransactionDto {
    id: string
    applicantId: string
    participantId?: string
    companyId?: string
}

interface DeleteTransactionDto {
    id: string
}

// Filter
interface TransactionFilterDto extends PaginationDto {
    id?: string
    year?: number
    participantIds?: string[]
    companyIds?: string[]
    keyword?: string
    deleted?: boolean
}

export {
    TransactionResponseDto,
    CreateTransactionRequestDto,
    CreateTransactionDto,
    UpdateTransactionDto,
    DeleteTransactionDto,
    TransactionFilterDto,
    TransactionType
}