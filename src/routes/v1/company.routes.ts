// company.routes.ts
import express from 'express';
import { findAllCompanies, createCompany } from '../../modules/company/company.controller.js';

const companyRouter = express.Router();

companyRouter.get('/', findAllCompanies);
companyRouter.post('/', createCompany);
companyRouter.put('/:id', createCompany);
companyRouter.delete('/:id', createCompany);

export {
    companyRouter
}