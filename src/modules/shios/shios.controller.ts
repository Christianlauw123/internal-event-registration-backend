// shio.controller.ts
// UI -> Services
import type { Request, Response } from "express";
import { ShioService } from "./shios.service.js";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateShioDto, DeleteShioDto, UpdateShioDto, ShioFilterDto } from "./shios.dto.js";
import { extractPagination } from "../../helper/pagination_helper.js";

const shioService = new ShioService()

async function findAllShios(req: Request, res: Response){
    const requestBody: ShioFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.indonesianShio && { indonesianShio: req.query.indonesianShio as string }),
        ...(req.query.mandarinShio && { mandarinShio: req.query.mandarinShio as string })
        ...extractPagination(req.query),
    }

    const response = await shioService.findAllShios(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No shios found", null, []))
    }
    return res.status(200).json(baseResponse("Shios found", null, response))
}

async function createShio(req: Request, res: Response){
    const requestBody: CreateShioDto = {
        indonesianShio: req.body.indonesianShio,
        mandarinShio: req.body.mandarinShio
    }

    const response = await shioService.createShio(requestBody)
    return res.status(201).json(baseResponse("Shio created", null, [response]))
}

async function updateShio(req: Request, res: Response){
    const requestBody: UpdateShioDto = {
        id: req.params.id as string,
        ...(req.query.indonesianShio && { indonesianShio: req.query.indonesianShio as string }),
        ...(req.query.mandarinShio && { mandarinShio: req.query.mandarinShio as string }),
    }

    const response = await shioService.updateShio(requestBody)
    return res.status(201).json(baseResponse("Shio updated", null, [response]))
}

async function deleteShio(req: Request, res: Response){
    const requestBody: DeleteShioDto = {
        id: req.params.id as string
    }

    const response = await shioService.deleteShio(requestBody)
    return res.status(201).json(baseResponse("Shio deleted", null, [response]))
}

export{
    findAllShios,
    createShio,
    updateShio,
    deleteShio
}