// company_owner.controller.ts
// UI -> Services
import type { Request, Response } from "express";
import { baseResponse } from "../../helper/response_helper.js";
import { activeYearFilter } from "../../helper/model_helper.js";
import { CompanyOwnerService } from "./company_owner.service.js";
import { CompanyOwnerFilterDto, CreateCompanyOwnerDto, DeleteCompanyOwnerDto } from "./company_owner.dto.js";
import { extractPagination } from "../../helper/pagination_helper.js";

const companyOwnerService = new CompanyOwnerService();

async function findAllCompanyOwners(req: Request, res: Response){
    const requestBody: CompanyOwnerFilterDto = {
        ...(req.query.companyId && { companyId: req.query.companyId as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" }),
        ...extractPagination(req.query),
        year: await activeYear()
    }

    const response = await companyOwnerService.findAllCompanyOwners(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No company owners found", null, []))
    }
    return res.status(200).json(baseResponse("Company owners found", null, response))
}

async function createCompanyOwner(req: Request, res: Response){
    const requestBody: CreateCompanyOwnerDto = {
        companyId: req.body.companyId,
        participantIds: req.body.participantIds,
        year: await activeYear()
    }

    const response = await companyOwnerService.createCompanyOwner(requestBody)
    return res.status(201).json(baseResponse("Company owner created", null, [response]))
}

async function deleteCompanyOwner(req: Request, res: Response){
    const requestBody: DeleteCompanyOwnerDto = {
        companyId: req.body.companyId,
        participantIds: req.body.participantIds
    }
    const response = await companyOwnerService.deleteCompanyOwner(requestBody)
    return res.status(201).json(baseResponse("Company owner deleted", null, [response]))
}

// private function to get active year, since we need to use it in multiple places in the controller
async function activeYear(){
    const activeYear = await activeYearFilter();
    return activeYear?.year as number
}

export {
    findAllCompanyOwners,
    createCompanyOwner,
    deleteCompanyOwner
}