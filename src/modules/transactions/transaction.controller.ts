// setting.controller.ts
// UI -> Services
import type { Request, Response } from "express";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateTransactionRequestDto, DeleteTransactionDto, TransactionFilterDto, UpdateTransactionDto } from "./transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { activeYearFilter } from "../../helper/model_helper.js";

const transactionService = new TransactionService()

async function findAllTransactions(req: Request, res: Response){
    const requestBody: TransactionFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await transactionService.findAllTransactions(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No transactions found", null, []))
    }
    return res.status(200).json(baseResponse("Transactions found", null, response))
}

async function createTransaction(req: Request, res: Response){
    // if (req.body.participantIds.length === 0 && req.body.companyIds.length === 0) {
    //     throw new BadRequestError("At least one participant or company must be provided");
    // }
    
    // // Check for duplicate participantIds and companyIds
    // const uniqueParticipantIds = new Set(req.body.participantIds);
    // const uniqueCompanyIds = new Set(req.body.companyIds);

    // if (uniqueParticipantIds.size !== req.body.participantIds.length) {
    //     throw new BadRequestError("Duplicate participantIds are not allowed");
    // }
    // if (uniqueCompanyIds.size !== req.body.companyIds.length) {
    //     throw new BadRequestError("Duplicate companyIds are not allowed");
    // }

    // const requestExistingTransactionBody: TransactionFilterDto = {
    //     year: req.body.year,
    //     participantIds: req.body.participantIds,
    //     companyIds: req.body.companyIds
    // }
    // const requestExistingTransaction = await transactionService.findAllTransactions(requestExistingTransactionBody)

    const activeYear = await activeYearFilter()
    const requestBody: CreateTransactionRequestDto = {
        applicantId: req.body.applicantId,
        participantIds: req.body.participantIds,
        companyIds: req.body.companyIds,
        year: activeYear.year as number
    }
    const response = await transactionService.createTransaction(requestBody)
    return res.status(201).json(baseResponse("Transaction created", null, [response]))
}

async function updateTransaction(req: Request, res: Response){
    const requestBody: UpdateTransactionDto = {
        id: req.params.id as string,
        ...(req.body.applicantId && { applicantId: req.body.applicantId as string }),
        ...(req.body.participantId && { participantId: req.body.participantId as string }),
        ...(req.body.companyId && { companyId: req.body.companyId as string })
    }

    const response = await transactionService.updateTransaction(requestBody)
    return res.status(201).json(baseResponse("Transaction updated", null, [response]))
}

async function deleteTransaction(req: Request, res: Response){
    const requestBody: DeleteTransactionDto = {
        id: req.params.id as string
    }

    const response = await transactionService.deleteTransaction(requestBody)
    return res.status(201).json(baseResponse("Transaction deleted", null, [response]))
}

export{
    findAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
}