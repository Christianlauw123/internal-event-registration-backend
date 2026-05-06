// transaction.routes.js
import express from 'express';
import { createTransaction, deleteTransaction, findAllTransactions, updateTransaction } from '../../modules/transactions/transaction.controller.js';

const transactionRouter = express.Router();

transactionRouter.get('/', findAllTransactions)
transactionRouter.post('/', createTransaction)
transactionRouter.put('/:id', updateTransaction)
transactionRouter.delete('/:id', deleteTransaction)

export {
    transactionRouter
}