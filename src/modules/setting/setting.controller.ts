// setting.controller.ts
// UI -> Services
import type { Request, Response } from "express";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateSettingDto, DeleteSettingDto, SettingFilterDto, UpdateSettingDto } from "./setting.dto.js";
import { SettingService } from "./setting.service.js";

const settingService = new SettingService()

async function findAllSettings(req: Request, res: Response){
    const requestBody: SettingFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await settingService.findAllSettings(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No settings found", null, []))
    }
    return res.status(200).json(baseResponse("Settings found", null, response))
}

async function createSetting(req: Request, res: Response){
    const requestBody: CreateSettingDto = {
        title: req.body.title,
        year: req.body.year
    }

    const response = await settingService.createSetting(requestBody)
    await settingService.settingActivation(response.id)
    return res.status(201).json(baseResponse("Setting created", null, [response]))
}

async function updateSetting(req: Request, res: Response){
    const requestBody: UpdateSettingDto = {
        id: req.params.id as string,
        ...(req.body.title && { title: req.body.title as string }),
        ...(req.body.year && { year: req.body.year as number }),
    }

    const response = await settingService.updateSetting(requestBody)
    return res.status(201).json(baseResponse("Setting updated", null, [response]))
}

async function deleteSetting(req: Request, res: Response){
    const requestBody: DeleteSettingDto = {
        id: req.params.id as string
    }

    const response = await settingService.deleteSetting(requestBody)
    return res.status(201).json(baseResponse("Setting deleted", null, [response]))
}

export{
    findAllSettings,
    createSetting,
    updateSetting,
    deleteSetting
}