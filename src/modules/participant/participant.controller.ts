// participant.controller.ts
// UI -> Services
import type { Request, Response } from "express";
import { baseResponse } from "../../helper/response_helper.js";
import { CreateParticipantDto, DeleteParticipantDto, ParticipantFilterDto, UpdateParticipantDto } from "./participant.dto.js";
import { ParticipantService } from "./participant.service.js";

const participantService = new ParticipantService()

async function findAllParticipants(req: Request, res: Response){
    const requestBody: ParticipantFilterDto = {
        ...(req.query.id && { id: req.query.id as string }),
        ...(req.query.keyword && { keyword: req.query.keyword as string }),
        ...(req.query.isMandarin !== undefined && { isMandarin: req.query.isMandarin === "true" }),
        ...(req.query.shioId && { shioId: req.query.shioId as string }),
        ...(req.query.deleted !== undefined && { deleted: req.query.deleted === "true" })
    }

    const response = await participantService.findAllParticipants(requestBody)
    if(response.length === 0){
        return res.status(404).json(baseResponse("No participants found", null, []))
    }
    return res.status(200).json(baseResponse("Participants found", null, response))
}

async function createParticipant(req: Request, res: Response){
    const requestBody: CreateParticipantDto = {
        name: req.body.name,
        isMandarin: req.body.isMandarin,
        shioId: req.body.shioId
    }

    const response = await participantService.createParticipant(requestBody)
    return res.status(201).json(baseResponse("Participant created", null, [response]))
}

async function updateParticipant(req: Request, res: Response){
    const requestBody: UpdateParticipantDto = {
        id: req.params.id as string,
        ...(req.body.name && { name: req.body.name as string }),
        ...(req.body.isMandarin !== undefined && { isMandarin: req.body.isMandarin as boolean }),
        ...(req.body.shioId && { shioId: req.body.shioId as string })
    }

    const response = await participantService.updateParticipant(requestBody)
    return res.status(201).json(baseResponse("Participant updated", null, [response]))
}

async function deleteParticipant(req: Request, res: Response){
    const requestBody: DeleteParticipantDto = {
        id: req.params.id as string
    }

    const response = await participantService.deleteParticipant(requestBody)
    return res.status(201).json(baseResponse("Participant deleted", null, [response]))
}

export{
    findAllParticipants,
    createParticipant,
    updateParticipant,
    deleteParticipant
}