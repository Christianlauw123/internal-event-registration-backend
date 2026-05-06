// company_owner.routes.ts
import express from 'express';
import { createCompanyOwner, deleteCompanyOwner, findAllCompanyOwners } from '../../modules/company_owner/company_owner.controller.js';

const companyOwnerRouter = express.Router();

companyOwnerRouter.get('/', findAllCompanyOwners);
companyOwnerRouter.post('/', createCompanyOwner);
companyOwnerRouter.delete('/:id', deleteCompanyOwner);

export {
    companyOwnerRouter
}