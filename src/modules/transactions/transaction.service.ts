// Brain Logic (Middle Man) - Controller -> (MM) -> Repository
// setting.service.ts
import { BadRequestError } from "../../helper/app_error_helper.js";
import { uuidValidator } from "../../helper/model_helper.js";
import { CreateTransactionDto, CreateTransactionRequestDto, DeleteTransactionDto, TransactionFilterDto, TransactionResponseDto, TransactionType, UpdateTransactionDto } from "./transaction.dto.js";
import { TransactionRepository } from "./transaction.repository.js";

class TransactionService{
    private TransactionRepo: TransactionRepository = new TransactionRepository();
    
    async findAllTransactions(filters: TransactionFilterDto | null): Promise<TransactionResponseDto[]>{
        const response = await this.TransactionRepo.findAllTransactions(filters)

        return response.map(transaction => ({
            id: transaction.id,
            sequence: transaction.sequence,
            isMandarin: transaction.isMandarin,
            transactionType: transaction.transactionType as TransactionType,
            year: transaction.year,
            participantId: transaction.participantId,
            companyId: transaction.companyId,
            applicantId: transaction.applicantId,
            deletedAt: transaction.deletedAt,
        }))
    }
    
    async createTransaction(req: CreateTransactionRequestDto): Promise<void> {
        // Trimming Data
        const participantTransactions = req.participantIds?.map(participantId => ({
            applicantId: req.applicantId,
            participantId: participantId,
            transactionType: TransactionType.PERORANGAN,
            year: req.year
        })) ?? []
        
        const companyTransactions =  req.companyIds.map(companyId => ({
            applicantId: req.applicantId,
            participantId: companyId,
            transactionType: TransactionType.PERUSAHAAN,
            year: req.year
        })) ?? []

        const requestBody: CreateTransactionDto[] = [
            ...participantTransactions,
            ...companyTransactions
        ]

        await this.TransactionRepo.createTransaction(requestBody)

        return;
    }

    async updateTransaction(req: UpdateTransactionDto): Promise<void> {
        const { id, ...updateData } = req;
        
        await this.findTransactionById(id);

        await this.TransactionRepo.updateTransaction(id, updateData)

        return;
    }

    async deleteTransaction(req: DeleteTransactionDto): Promise<void> {
        const { id, ...existingTransaction } = await this.findTransactionById(req.id);
        await this.TransactionRepo.deleteTransaction(id, existingTransaction);
        return;
    }

    private async findTransactionById(id: string){
        uuidValidator(id);

        const response = await this.TransactionRepo.findAllTransactions({ id: id })
        if(response.length === 0){
            throw new BadRequestError("Transaction not found");
        }
        return response[0];
    }
}

export{
    TransactionService
}