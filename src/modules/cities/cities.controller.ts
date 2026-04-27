// UI -> Services
// cities.controller.ts
import type { Request, Response } from "express";
import { CityService } from "./cities.service.js";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateCityDto, DeleteCityDto, UpdateCityDto, CityFilterDto } from "./cities.dto.js";

const cityService = new CityService()

async function findAllCities(req: Request, res: Response){
    const requestBody: CityFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await cityService.findAllCities(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No cities found", null, []))
    }
    return res.status(200).json(baseResponse("Cities found", null, response))
}

async function createCity(req: Request, res: Response){
    const requestBody: CreateCityDto = {
        name: req.body.name
    }

    const response = await cityService.createCity(requestBody)
    return res.status(201).json(baseResponse("City created", null, [response]))
}

async function updateCity(req: Request, res: Response){
    const requestBody: UpdateCityDto = {
        id: req.params.id as string,
        ...(req.body.name && { name: req.body.name as string }),
    }

    const response = await cityService.updateCity(requestBody)
    return res.status(201).json(baseResponse("City updated", null, [response]))
}

async function deleteCity(req: Request, res: Response){
    const requestBody: DeleteCityDto = {
        id: req.params.id as string
    }

    const response = await cityService.deleteCity(requestBody)
    return res.status(201).json(baseResponse("City deleted", null, [response]))
}

export{
    findAllCities,
    createCity,
    updateCity,
    deleteCity
}