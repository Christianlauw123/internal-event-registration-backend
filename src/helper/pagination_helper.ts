interface PaginationDto {
    page?: number
    limit?: number
    offset?: number
}

function extractPagination(query: any): PaginationDto {
    const page = query.page ? Number(query.page) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    return {
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { limit }),
        ...(page !== undefined && limit !== undefined && { offset: page * limit }),
    };
}

export {
    PaginationDto,
    extractPagination
}