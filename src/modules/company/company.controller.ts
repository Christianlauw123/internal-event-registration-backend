// company.controller.ts
import { Request, Response } from 'express';
import { CompanyService } from './company.service.js';
import { baseResponse } from '../../helper/response_helper.js';
import { CompanyFilterDto, CreateCompanyDto, DeleteCompanyDto, UpdateCompanyDto } from './company.dto.js';

const companyService = new CompanyService();

async function findAllCompanies(req: Request, res: Response){
    const requestBody: CompanyFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.cityId && { cityId: req.query.cityId as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await companyService.findAllCompanies(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No companies found", null, []))
    }
    return res.status(200).json(baseResponse("Companies found", null, response))
}

async function createCompany(req: Request, res: Response){
    const requestBody: CreateCompanyDto = {
        name: req.body.name,
        address: req.body.address,
        cityId: req.body.cityId
    }

    const response = await companyService.createCompany(requestBody)
    return res.status(201).json(baseResponse("Company created", null, [response]))
}

async function updateCompany(req: Request, res: Response){
    const requestBody: UpdateCompanyDto = {
        id: req.params.id as string,
        ...(req.body.name && { name: req.body.name as string }),
        ...(req.body.address && { address: req.body.address as string }),
        ...(req.body.cityId && { cityId: req.body.cityId as string })
    }

    const response = await companyService.updateCompany(requestBody)
    return res.status(201).json(baseResponse("Company updated", null, [response]))
}

async function deleteCompany(req: Request, res: Response){
    const requestBody: DeleteCompanyDto = {
        id: req.params.id as string
    }

    const response = await companyService.deleteCompany(requestBody)
    return res.status(201).json(baseResponse("Company deleted", null, [response]))
}

export {
    findAllCompanies,
    createCompany,
    updateCompany,
    deleteCompany
}